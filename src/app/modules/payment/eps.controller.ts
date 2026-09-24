import crypto from "crypto";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Order } from "../order/order.model";
import { TEpsPaymentAttempt } from "../order/order.interface";
import EpsService from "./eps.service";
import { EpsVerifyResponse } from "./payment.interface";
import {
  applyPaymentProgress,
  getOutstandingAmounts,
  toTwoDecimals,
} from "./payment.utils";

type EpsOutcome = "success" | "failed" | "cancelled" | "pending";

// EPS requires these customer fields but checkout no longer collects them.
const FALLBACK_CUSTOMER_EMAIL = "evotech.bd22@gmail.com";
const FALLBACK_POSTCODE = "1206";
// Cap on gateway calls when reconciling a customer's earlier attempts
const MAX_ATTEMPTS_TO_RECONCILE = 3;

// 13-digit ms timestamp + 4 random digits: numeric and unique, as EPS expects
const generateMerchantTransactionId = () =>
  `${Date.now()}${crypto.randomInt(0, 10_000).toString().padStart(4, "0")}`;

const toEpsPhone = (phone?: string) => {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.startsWith("880") ? `0${digits.slice(3)}` : digits;
};

const findOrderOrThrow = async (orderId: unknown) => {
  if (typeof orderId !== "string" || !Types.ObjectId.isValid(orderId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid order ID");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }
  if (order.paymentMethod !== "eps") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This order is not set up for online payment",
    );
  }
  return order;
};

// EPS reports an attempt whose payment page is still open as "Cancel", so
// failed/cancelled are provisional: a later check may still find it paid.
// Only success and amount_mismatch are final.
const UNSETTLED_STATUSES: TEpsPaymentAttempt["status"][] = [
  "initiated",
  "failed",
  "cancelled",
];

// Field names differ between EPS responses; mirror EPS's own PHP sample.
const readGatewayStatus = (verification: EpsVerifyResponse) => {
  const v = verification as any;
  const raw =
    v.Status ??
    v.status ??
    v.transactionStatus ??
    v.data?.transactionStatus ??
    v.data?.status ??
    "";
  return String(raw).toLowerCase();
};

const readEpsTransactionId = (verification: EpsVerifyResponse) =>
  verification.EPSTransactionId ?? (verification as any).EpsTransactionId;

/**
 * Record the gateway's verdict on one attempt and, for a verified success,
 * credit the order. The attempt is claimed atomically, so a payment is
 * applied once even if the redirect, a retry and a reconcile race.
 */
const settleAttempt = async (
  orderId: Types.ObjectId | string,
  attempt: TEpsPaymentAttempt,
  verification: EpsVerifyResponse,
): Promise<EpsOutcome> => {
  const { merchantTransactionId } = attempt;
  const status = readGatewayStatus(verification);
  const openAttempt = {
    _id: orderId,
    epsPayments: {
      $elemMatch: {
        merchantTransactionId,
        status: { $in: UNSETTLED_STATUSES },
      },
    },
  };

  if (status === "success" || status === "completed") {
    const paidAmount = Number(verification.TotalAmount) || 0;
    const matchesAttempt =
      verification.MerchantTransactionId === merchantTransactionId &&
      paidAmount + 0.01 >= attempt.amount;

    if (!matchesAttempt) {
      console.error("EPS verification does not match attempt:", {
        orderId: String(orderId),
        attempt,
        verification,
      });
      await Order.updateOne(openAttempt, {
        $set: {
          "epsPayments.$.status": "amount_mismatch",
          "epsPayments.$.verifiedAt": new Date(),
        },
      });
      return "failed";
    }

    const claimed = await Order.findOneAndUpdate(
      openAttempt,
      {
        $set: {
          "epsPayments.$.status": "success",
          "epsPayments.$.epsTransactionId": readEpsTransactionId(verification),
          "epsPayments.$.financialEntity":
            verification.FinancialEntity ?? undefined,
          "epsPayments.$.verifiedAt": new Date(),
        },
      },
      { new: true },
    );

    // Not claimed means another request already settled this attempt
    if (claimed) {
      applyPaymentProgress(claimed, attempt.amount);
      claimed.transactionId = readEpsTransactionId(verification);
      await claimed.save();
    }
    return "success";
  }

  if (status.includes("fail") || status.includes("cancel")) {
    const outcome: EpsOutcome = status.includes("cancel")
      ? "cancelled"
      : "failed";
    await Order.updateOne(openAttempt, {
      $set: {
        "epsPayments.$.status": outcome,
        "epsPayments.$.verifiedAt": new Date(),
      },
    });
    // Surface the failure to admins only while nothing has been paid
    await Order.updateOne(
      { _id: orderId, paymentStatus: "pending" },
      { $set: { paymentStatus: "failed" } },
    );
    return outcome;
  }

  return "pending";
};

/**
 * Re-check attempts that haven't settled (customer closed the tab, paid in
 * an older tab, the redirect never reached us, ...). Returns the outcome of
 * the newest one.
 */
const reconcileOpenAttempts = async (orderId: Types.ObjectId | string) => {
  const order = await Order.findById(orderId).lean();
  const open = (order?.epsPayments || [])
    .filter((a) => UNSETTLED_STATUSES.includes(a.status))
    .slice(-MAX_ATTEMPTS_TO_RECONCILE);

  let latest: EpsOutcome | null = null;
  for (const attempt of open) {
    try {
      const verification = await EpsService.verifyPayment(
        attempt.merchantTransactionId,
      );
      latest = await settleAttempt(orderId, attempt, verification);
    } catch (error) {
      console.error(
        `EPS reconcile failed for ${attempt.merchantTransactionId}:`,
        error,
      );
      latest = "pending";
    }
  }
  return latest;
};

/**
 * Start (or retry) an EPS payment for an order and return the hosted
 * payment page URL. Charges the outstanding Group Buy deposit first, then
 * the balance — the same "due now" amount checkout shows.
 */
const initiateEpsPayment = catchAsync(async (req: Request, res: Response) => {
  const order = await findOrderOrThrow(req.body?.orderId);

  if (order.orderStatus === "cancelled") {
    throw new AppError(httpStatus.BAD_REQUEST, "This order has been cancelled");
  }

  // An earlier attempt may have succeeded without us hearing back; settle
  // it first so the customer is never charged twice.
  await reconcileOpenAttempts(order._id);
  const freshOrder = await Order.findById(order._id);
  if (!freshOrder) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const { depositOutstanding, balanceOutstanding } =
    getOutstandingAmounts(freshOrder);
  const amount = toTwoDecimals(
    depositOutstanding > 0 ? depositOutstanding : balanceOutstanding,
  );
  if (amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This order has no outstanding amount to pay",
    );
  }

  const merchantTransactionId = generateMerchantTransactionId();
  // Persist the attempt before redirecting so the callback can always find it
  await Order.updateOne(
    { _id: freshOrder._id },
    { $push: { epsPayments: { merchantTransactionId, amount } } },
  );

  const callbackBase = `${config.backend_url}/api/v1/payment/eps/callback`;
  const orderRef = freshOrder.orderNumber;
  const isDeposit = depositOutstanding > 0 && !!freshOrder.isPreOrderOrder;
  const productName = `Evo-Tech order ${orderRef}${isDeposit ? " (advance)" : ""}`;

  try {
    const result = await EpsService.initializePayment({
      customerOrderId: orderRef,
      merchantTransactionId,
      totalAmount: amount,
      successUrl: `${callbackBase}/success/${merchantTransactionId}`,
      failUrl: `${callbackBase}/fail/${merchantTransactionId}`,
      cancelUrl: `${callbackBase}/cancel/${merchantTransactionId}`,
      customerName:
        `${freshOrder.firstname} ${freshOrder.lastname || ""}`.trim(),
      customerEmail: freshOrder.email || FALLBACK_CUSTOMER_EMAIL,
      customerPhone: toEpsPhone(freshOrder.phone),
      customerAddress: freshOrder.houseStreet,
      customerCity: freshOrder.city,
      customerState: freshOrder.subdistrict || freshOrder.city,
      customerPostcode: freshOrder.postcode || FALLBACK_POSTCODE,
      productName,
      noOfItem: 1,
      productList: [
        {
          ProductName: productName,
          NoOfItem: "1",
          ProductProfile: "general",
          ProductCategory: "general",
          ProductPrice: amount.toFixed(2),
        },
      ],
      ipAddress: req.ip,
      valueA: String(freshOrder._id),
    });

    await Order.updateOne(
      {
        _id: freshOrder._id,
        "epsPayments.merchantTransactionId": merchantTransactionId,
      },
      { $set: { "epsPayments.$.epsTransactionId": result.TransactionId } },
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment session created",
      data: { redirectURL: result.RedirectURL, amount },
    });
  } catch (error) {
    await Order.updateOne(
      {
        _id: freshOrder._id,
        "epsPayments.merchantTransactionId": merchantTransactionId,
      },
      { $set: { "epsPayments.$.status": "failed" } },
    );
    throw error;
  }
});

/**
 * EPS sends the customer's browser here (GET or POST) after payment. The
 * path's outcome is only a hint: the gateway's status API is the source of
 * truth. Always ends in a redirect to the storefront result page.
 */
const handleEpsCallback = async (req: Request, res: Response) => {
  const { outcome: returnedOutcome, merchantTransactionId } = req.params;
  const resultUrl = new URL("/payment/eps", config.frontend_url);

  if (
    !["success", "fail", "cancel"].includes(returnedOutcome) ||
    !/^\d{10,30}$/.test(merchantTransactionId)
  ) {
    resultUrl.searchParams.set("status", "error");
    return res.redirect(resultUrl.toString());
  }

  try {
    const order = await Order.findOne({
      "epsPayments.merchantTransactionId": merchantTransactionId,
    });
    if (!order) {
      resultUrl.searchParams.set("status", "error");
      return res.redirect(resultUrl.toString());
    }

    resultUrl.searchParams.set("order", String(order._id));
    if (order.trackingCode) {
      resultUrl.searchParams.set("code", order.trackingCode);
    }

    const attempt = order.epsPayments!.find(
      (a) => a.merchantTransactionId === merchantTransactionId,
    )!;

    let outcome: EpsOutcome;
    if (attempt.status === "success") {
      // Already credited (page refresh / duplicate redirect)
      outcome = "success";
    } else if (attempt.status === "amount_mismatch") {
      outcome = "failed";
    } else {
      const verification = await EpsService.verifyPayment(
        merchantTransactionId,
      );
      outcome = await settleAttempt(order._id, attempt, verification);
    }

    resultUrl.searchParams.set("status", outcome);
  } catch (error) {
    console.error(`EPS callback failed for ${merchantTransactionId}:`, error);
    // We could not confirm either way; the result page re-checks later
    resultUrl.searchParams.set("status", "pending");
  }

  return res.redirect(resultUrl.toString());
};

/**
 * Re-check an order's pending EPS attempts and report where payment stands.
 * Used by the storefront result page when the redirect could not confirm.
 */
const verifyEpsPayment = catchAsync(async (req: Request, res: Response) => {
  const order = await findOrderOrThrow(req.body?.orderId);
  const latestOutcome = await reconcileOpenAttempts(order._id);
  const updated = await Order.findById(order._id).lean();
  const { depositOutstanding, balanceOutstanding } = getOutstandingAmounts(
    updated ?? {},
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status retrieved",
    data: {
      paymentStatus: updated?.paymentStatus,
      latestOutcome,
      outstanding: toTwoDecimals(
        depositOutstanding > 0 ? depositOutstanding : balanceOutstanding,
      ),
      trackingCode: updated?.trackingCode,
    },
  });
});

export const EpsControllers = {
  initiateEpsPayment,
  handleEpsCallback,
  verifyEpsPayment,
};
