import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import BkashService from "./payment.service";
import config from "../../config";
import { Order } from "../order/order.model";
import AppError from "../../errors/AppError";
import {
  applyPaymentProgress,
  getOutstandingAmounts,
  toTwoDecimals,
} from "./payment.utils";

/**
 * Create a bKash payment
 */
const createBkashPayment = catchAsync(async (req: Request, res: Response) => {
  const { amount, orderId } = req.body;

  // Validate order exists
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Check if order already has a payment
  if (order.bkashPaymentID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment already initiated for this order"
    );
  }

  const { depositOutstanding, balanceOutstanding } =
    getOutstandingAmounts(order);

  let amountToCharge =
    depositOutstanding > 0 ? depositOutstanding : balanceOutstanding;

  if (!amountToCharge || amountToCharge <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No outstanding amount due for this order"
    );
  }

  const paymentData = {
    mode: "0011" as const,
    payerReference: order.phone || "01619777283",
    callbackURL: `${config.frontend_url}/payment/callback`,
    amount: toTwoDecimals(amountToCharge).toFixed(2),
    currency: "BDT" as const,
    intent: "sale" as const,
    merchantInvoiceNumber: order.orderNumber || orderId,
  };

  const result = await BkashService.createPayment(paymentData);

  // Update order with payment ID
  await Order.findByIdAndUpdate(orderId, {
    bkashPaymentID: result.paymentID,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment created successfully",
    data: {
      paymentID: result.paymentID,
      bkashURL: result.bkashURL,
      amount: result.amount,
      transactionStatus: result.transactionStatus,
    },
  });
});

/**
 * Execute bKash payment after user authorization
 */
const executeBkashPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, orderId } = req.body;

  // Execute the payment
  const result = await BkashService.executePayment(paymentID);

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  order.bkashTransactionId = result.trxID;
  order.paymentMethod = "bkash";

  if (result.transactionStatus === "Completed") {
    const paidAmount = Number(result.amount) || 0;
    applyPaymentProgress(order, paidAmount);
  }

  await order.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment executed successfully",
    data: {
      paymentID: result.paymentID,
      trxID: result.trxID,
      transactionStatus: result.transactionStatus,
      amount: result.amount,
    },
  });
});

/**
 * Query bKash payment status
 */
const queryBkashPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentID } = req.params;

  const result = await BkashService.queryPayment(paymentID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status retrieved successfully",
    data: result,
  });
});

/**
 * Handle bKash callback (success/failure/cancel)
 */
const handleBkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;

  if (status === "success" && paymentID) {
    // Query payment to get the latest status
    const paymentStatus = await BkashService.queryPayment(paymentID as string);

    // Find order by payment ID and update
    const order = await Order.findOne({ bkashPaymentID: paymentID });

    if (order) {
      order.bkashTransactionId = paymentStatus.trxID || "";
      if (paymentStatus.transactionStatus === "Completed") {
        const paidAmount = Number(paymentStatus.amount) || 0;
        applyPaymentProgress(order, paidAmount);
      }
      await order.save();
    }

    // Redirect to success page
    res.redirect(
      `${config.frontend_url}/order/${order?.orderNumber}?status=success`
    );
  } else if (status === "failure") {
    // Mark the associated order's payment as failed
    if (paymentID) {
      await Order.findOneAndUpdate(
        { bkashPaymentID: paymentID },
        { paymentStatus: "failed" }
      );
    }
    res.redirect(`${config.frontend_url}/checkout?status=failure`);
  } else if (status === "cancel") {
    // Mark the associated order's payment as failed (user cancelled payment)
    if (paymentID) {
      await Order.findOneAndUpdate(
        { bkashPaymentID: paymentID },
        { paymentStatus: "failed" }
      );
    }
    res.redirect(`${config.frontend_url}/checkout?status=cancel`);
  } else {
    res.redirect(`${config.frontend_url}/checkout?status=error`);
  }
});

/**
 * Webhook handler for bKash notifications
 */
const handleBkashWebhook = catchAsync(async (req: Request, res: Response) => {
  const webhookData = req.body;

  // Log webhook data for debugging

  // Process webhook based on event type
  if (webhookData.paymentID) {
    const paymentStatus = await BkashService.queryPayment(
      webhookData.paymentID
    );

    // Update order status
    const order = await Order.findOne({
      bkashPaymentID: webhookData.paymentID,
    });

    if (order) {
      order.bkashTransactionId = paymentStatus.trxID || "";
      if (paymentStatus.transactionStatus === "Completed") {
        const paidAmount = Number(paymentStatus.amount) || 0;
        applyPaymentProgress(order, paidAmount);
      }
      await order.save();
    }
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Webhook processed successfully",
    data: null,
  });
});

export const PaymentControllers = {
  createBkashPayment,
  executeBkashPayment,
  queryBkashPayment,
  handleBkashCallback,
  handleBkashWebhook,
};
