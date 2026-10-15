"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpsControllers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_model_1 = require("../order/order.model");
const eps_service_1 = __importDefault(require("./eps.service"));
const payment_utils_1 = require("./payment.utils");
const payment_log_service_1 = require("../payment-log/payment-log.service");
// EPS requires these customer fields but checkout no longer collects them.
const FALLBACK_CUSTOMER_EMAIL = "evotech.bd22@gmail.com";
const FALLBACK_POSTCODE = "1206";
// Cap on gateway calls when reconciling a customer's earlier attempts
const MAX_ATTEMPTS_TO_RECONCILE = 3;
// 13-digit ms timestamp + 4 random digits: numeric and unique, as EPS expects
const generateMerchantTransactionId = () => `${Date.now()}${crypto_1.default.randomInt(0, 10000).toString().padStart(4, "0")}`;
const toEpsPhone = (phone) => {
    const digits = (phone || "").replace(/\D/g, "");
    return digits.startsWith("880") ? `0${digits.slice(3)}` : digits;
};
const findOrderOrThrow = async (orderId) => {
    if (typeof orderId !== "string" || !mongoose_1.Types.ObjectId.isValid(orderId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid order ID");
    }
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    if (order.paymentMethod !== "eps") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This order is not set up for online payment");
    }
    return order;
};
// EPS reports an attempt whose payment page is still open as "Cancel", so
// failed/cancelled are provisional: a later check may still find it paid.
// Only success and amount_mismatch are final.
const UNSETTLED_STATUSES = [
    "initiated",
    "failed",
    "cancelled",
];
// Field names differ between EPS responses; mirror EPS's own PHP sample.
const readGatewayStatus = (verification) => {
    const v = verification;
    const raw = v.Status ??
        v.status ??
        v.transactionStatus ??
        v.data?.transactionStatus ??
        v.data?.status ??
        "";
    return String(raw).toLowerCase();
};
const readEpsTransactionId = (verification) => verification.EPSTransactionId ?? verification.EpsTransactionId;
/**
 * Record the gateway's verdict on one attempt and, for a verified success,
 * credit the order. The attempt is claimed atomically, so a payment is
 * applied once even if the redirect, a retry and a reconcile race.
 */
const settleAttempt = async (orderId, attempt, verification) => {
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
        const matchesAttempt = verification.MerchantTransactionId === merchantTransactionId &&
            paidAmount + 0.01 >= attempt.amount;
        if (!matchesAttempt) {
            console.error("EPS verification does not match attempt:", {
                orderId: String(orderId),
                attempt,
                verification,
            });
            const mismatched = await order_model_1.Order.findOneAndUpdate(openAttempt, {
                $set: {
                    "epsPayments.$.status": "amount_mismatch",
                    "epsPayments.$.verifiedAt": new Date(),
                },
            }, { new: true });
            // Order is left untouched, so force an entry to keep the rejection visible
            if (mismatched) {
                const snapshot = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(mismatched);
                await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(snapshot, mismatched, {
                    event: "payment_failed",
                    source: "gateway",
                    method: "eps",
                    transactionId: readEpsTransactionId(verification),
                    note: `EPS amount mismatch: expected ${attempt.amount}, gateway reported ${paidAmount}`,
                });
            }
            return "failed";
        }
        const claimed = await order_model_1.Order.findOneAndUpdate(openAttempt, {
            $set: {
                "epsPayments.$.status": "success",
                "epsPayments.$.epsTransactionId": readEpsTransactionId(verification),
                "epsPayments.$.financialEntity": verification.FinancialEntity ?? undefined,
                "epsPayments.$.verifiedAt": new Date(),
            },
        }, { new: true });
        // Not claimed means another request already settled this attempt
        if (claimed) {
            const paymentBefore = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(claimed);
            (0, payment_utils_1.applyPaymentProgress)(claimed, attempt.amount);
            claimed.transactionId = readEpsTransactionId(verification);
            await claimed.save();
            await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(paymentBefore, claimed, {
                source: "gateway",
                method: "eps",
                transactionId: claimed.transactionId,
            });
        }
        return "success";
    }
    if (status.includes("fail") || status.includes("cancel")) {
        const outcome = status.includes("cancel")
            ? "cancelled"
            : "failed";
        await order_model_1.Order.updateOne(openAttempt, {
            $set: {
                "epsPayments.$.status": outcome,
                "epsPayments.$.verifiedAt": new Date(),
            },
        });
        // Surface the failure to admins only while nothing has been paid
        const failed = await order_model_1.Order.findOneAndUpdate({ _id: orderId, paymentStatus: "pending" }, { $set: { paymentStatus: "failed" } }, { new: true });
        if (failed) {
            await payment_log_service_1.PaymentLogServices.logOrderPaymentChange({ paymentStatus: "pending", amountPaid: failed.amountPaid ?? 0 }, failed, {
                source: "gateway",
                method: "eps",
                note: outcome === "cancelled"
                    ? "EPS payment cancelled"
                    : "EPS payment failed",
            });
        }
        return outcome;
    }
    return "pending";
};
/**
 * Re-check attempts that haven't settled (customer closed the tab, paid in
 * an older tab, the redirect never reached us, ...). Returns the outcome of
 * the newest one.
 */
const reconcileOpenAttempts = async (orderId) => {
    const order = await order_model_1.Order.findById(orderId).lean();
    const open = (order?.epsPayments || [])
        .filter((a) => UNSETTLED_STATUSES.includes(a.status))
        .slice(-MAX_ATTEMPTS_TO_RECONCILE);
    let latest = null;
    for (const attempt of open) {
        try {
            const verification = await eps_service_1.default.verifyPayment(attempt.merchantTransactionId);
            latest = await settleAttempt(orderId, attempt, verification);
        }
        catch (error) {
            console.error(`EPS reconcile failed for ${attempt.merchantTransactionId}:`, error);
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
const initiateEpsPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const order = await findOrderOrThrow(req.body?.orderId);
    if (order.orderStatus === "cancelled") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This order has been cancelled");
    }
    // An earlier attempt may have succeeded without us hearing back; settle
    // it first so the customer is never charged twice.
    await reconcileOpenAttempts(order._id);
    const freshOrder = await order_model_1.Order.findById(order._id);
    if (!freshOrder) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const { depositOutstanding, balanceOutstanding } = (0, payment_utils_1.getOutstandingAmounts)(freshOrder);
    const amount = (0, payment_utils_1.toTwoDecimals)(depositOutstanding > 0 ? depositOutstanding : balanceOutstanding);
    if (amount <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This order has no outstanding amount to pay");
    }
    const merchantTransactionId = generateMerchantTransactionId();
    // Persist the attempt before redirecting so the callback can always find it
    await order_model_1.Order.updateOne({ _id: freshOrder._id }, { $push: { epsPayments: { merchantTransactionId, amount } } });
    const callbackBase = `${config_1.default.backend_url}/api/v1/payment/eps/callback`;
    const orderRef = freshOrder.orderNumber;
    const isDeposit = depositOutstanding > 0 && !!freshOrder.isPreOrderOrder;
    const productName = `Evo-Tech order ${orderRef}${isDeposit ? " (advance)" : ""}`;
    try {
        const result = await eps_service_1.default.initializePayment({
            customerOrderId: orderRef,
            merchantTransactionId,
            totalAmount: amount,
            successUrl: `${callbackBase}/success/${merchantTransactionId}`,
            failUrl: `${callbackBase}/fail/${merchantTransactionId}`,
            cancelUrl: `${callbackBase}/cancel/${merchantTransactionId}`,
            customerName: `${freshOrder.firstname} ${freshOrder.lastname || ""}`.trim(),
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
        await order_model_1.Order.updateOne({
            _id: freshOrder._id,
            "epsPayments.merchantTransactionId": merchantTransactionId,
        }, { $set: { "epsPayments.$.epsTransactionId": result.TransactionId } });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Payment session created",
            data: { redirectURL: result.RedirectURL, amount },
        });
    }
    catch (error) {
        await order_model_1.Order.updateOne({
            _id: freshOrder._id,
            "epsPayments.merchantTransactionId": merchantTransactionId,
        }, { $set: { "epsPayments.$.status": "failed" } });
        throw error;
    }
});
/**
 * EPS sends the customer's browser here (GET or POST) after payment. The
 * path's outcome is only a hint: the gateway's status API is the source of
 * truth. Always ends in a redirect to the storefront result page.
 */
const handleEpsCallback = async (req, res) => {
    const { outcome: returnedOutcome, merchantTransactionId } = req.params;
    const resultUrl = new URL("/payment/eps", config_1.default.frontend_url);
    if (!["success", "fail", "cancel"].includes(returnedOutcome) ||
        !/^\d{10,30}$/.test(merchantTransactionId)) {
        resultUrl.searchParams.set("status", "error");
        return res.redirect(resultUrl.toString());
    }
    try {
        const order = await order_model_1.Order.findOne({
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
        const attempt = order.epsPayments.find((a) => a.merchantTransactionId === merchantTransactionId);
        let outcome;
        if (attempt.status === "success") {
            // Already credited (page refresh / duplicate redirect)
            outcome = "success";
        }
        else if (attempt.status === "amount_mismatch") {
            outcome = "failed";
        }
        else {
            const verification = await eps_service_1.default.verifyPayment(merchantTransactionId);
            outcome = await settleAttempt(order._id, attempt, verification);
        }
        resultUrl.searchParams.set("status", outcome);
    }
    catch (error) {
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
const verifyEpsPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const order = await findOrderOrThrow(req.body?.orderId);
    const latestOutcome = await reconcileOpenAttempts(order._id);
    const updated = await order_model_1.Order.findById(order._id).lean();
    const { depositOutstanding, balanceOutstanding } = (0, payment_utils_1.getOutstandingAmounts)(updated ?? {});
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment status retrieved",
        data: {
            paymentStatus: updated?.paymentStatus,
            latestOutcome,
            outstanding: (0, payment_utils_1.toTwoDecimals)(depositOutstanding > 0 ? depositOutstanding : balanceOutstanding),
            trackingCode: updated?.trackingCode,
        },
    });
});
exports.EpsControllers = {
    initiateEpsPayment,
    handleEpsCallback,
    verifyEpsPayment,
};
//# sourceMappingURL=eps.controller.js.map