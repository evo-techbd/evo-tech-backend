"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const payment_service_1 = __importDefault(require("./payment.service"));
const config_1 = __importDefault(require("../../config"));
const order_model_1 = require("../order/order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const payment_utils_1 = require("./payment.utils");
const payment_log_service_1 = require("../payment-log/payment-log.service");
/**
 * Create a bKash payment
 */
const createBkashPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { amount, orderId } = req.body;
    // Validate order exists
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Check if order already has a payment
    if (order.bkashPaymentID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment already initiated for this order");
    }
    const { depositOutstanding, balanceOutstanding } = (0, payment_utils_1.getOutstandingAmounts)(order);
    let amountToCharge = depositOutstanding > 0 ? depositOutstanding : balanceOutstanding;
    if (!amountToCharge || amountToCharge <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No outstanding amount due for this order");
    }
    const paymentData = {
        mode: "0011",
        payerReference: order.phone || "01619777283",
        callbackURL: `${config_1.default.frontend_url}/payment/callback`,
        amount: (0, payment_utils_1.toTwoDecimals)(amountToCharge).toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: order.orderNumber || orderId,
    };
    const result = await payment_service_1.default.createPayment(paymentData);
    // Update order with payment ID
    await order_model_1.Order.findByIdAndUpdate(orderId, {
        bkashPaymentID: result.paymentID,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const executeBkashPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentID, orderId } = req.body;
    // Execute the payment
    const result = await payment_service_1.default.executePayment(paymentID);
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const paymentBefore = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(order);
    order.bkashTransactionId = result.trxID;
    order.paymentMethod = "bkash";
    if (result.transactionStatus === "Completed") {
        const paidAmount = Number(result.amount) || 0;
        (0, payment_utils_1.applyPaymentProgress)(order, paidAmount);
    }
    await order.save();
    await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(paymentBefore, order, {
        source: "gateway",
        method: "bkash",
        transactionId: result.trxID,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const queryBkashPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentID } = req.params;
    const result = await payment_service_1.default.queryPayment(paymentID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment status retrieved successfully",
        data: result,
    });
});
// findOneAndUpdate returns the order as it was before being marked failed.
const logBkashFailure = async (previous, note) => {
    if (!previous)
        return;
    await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(previous), { ...previous.toObject(), paymentStatus: "failed" }, { source: "gateway", method: "bkash", note });
};
/**
 * Handle bKash callback (success/failure/cancel)
 */
const handleBkashCallback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentID, status } = req.query;
    if (status === "success" && paymentID) {
        // Query payment to get the latest status
        const paymentStatus = await payment_service_1.default.queryPayment(paymentID);
        // Find order by payment ID and update
        const order = await order_model_1.Order.findOne({ bkashPaymentID: paymentID });
        if (order) {
            const paymentBefore = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(order);
            order.bkashTransactionId = paymentStatus.trxID || "";
            if (paymentStatus.transactionStatus === "Completed") {
                const paidAmount = Number(paymentStatus.amount) || 0;
                (0, payment_utils_1.applyPaymentProgress)(order, paidAmount);
            }
            await order.save();
            await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(paymentBefore, order, {
                source: "gateway",
                method: "bkash",
                transactionId: paymentStatus.trxID,
            });
        }
        // Redirect to success page
        res.redirect(`${config_1.default.frontend_url}/order/${order?.orderNumber}?status=success`);
    }
    else if (status === "failure") {
        // Mark the associated order's payment as failed
        if (paymentID) {
            const previous = await order_model_1.Order.findOneAndUpdate({ bkashPaymentID: paymentID }, { paymentStatus: "failed" });
            await logBkashFailure(previous, "bKash payment failed");
        }
        res.redirect(`${config_1.default.frontend_url}/checkout?status=failure`);
    }
    else if (status === "cancel") {
        // Mark the associated order's payment as failed (user cancelled payment)
        if (paymentID) {
            const previous = await order_model_1.Order.findOneAndUpdate({ bkashPaymentID: paymentID }, { paymentStatus: "failed" });
            await logBkashFailure(previous, "bKash payment cancelled by customer");
        }
        res.redirect(`${config_1.default.frontend_url}/checkout?status=cancel`);
    }
    else {
        res.redirect(`${config_1.default.frontend_url}/checkout?status=error`);
    }
});
/**
 * Webhook handler for bKash notifications
 */
const handleBkashWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const webhookData = req.body;
    // Log webhook data for debugging
    // Process webhook based on event type
    if (webhookData.paymentID) {
        const paymentStatus = await payment_service_1.default.queryPayment(webhookData.paymentID);
        // Update order status
        const order = await order_model_1.Order.findOne({
            bkashPaymentID: webhookData.paymentID,
        });
        if (order) {
            const paymentBefore = payment_log_service_1.PaymentLogServices.orderPaymentSnapshot(order);
            order.bkashTransactionId = paymentStatus.trxID || "";
            if (paymentStatus.transactionStatus === "Completed") {
                const paidAmount = Number(paymentStatus.amount) || 0;
                (0, payment_utils_1.applyPaymentProgress)(order, paidAmount);
            }
            await order.save();
            await payment_log_service_1.PaymentLogServices.logOrderPaymentChange(paymentBefore, order, {
                source: "gateway",
                method: "bkash",
                transactionId: paymentStatus.trxID,
            });
        }
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Webhook processed successfully",
        data: null,
    });
});
exports.PaymentControllers = {
    createBkashPayment,
    executeBkashPayment,
    queryBkashPayment,
    handleBkashCallback,
    handleBkashWebhook,
};
//# sourceMappingURL=payment.controller.js.map