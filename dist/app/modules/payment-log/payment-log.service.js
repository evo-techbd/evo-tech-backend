"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLogServices = void 0;
const mongoose_1 = require("mongoose");
const payment_log_model_1 = require("./payment-log.model");
const toTwoDecimals = (value) => Math.round(value * 100) / 100;
const toObjectId = (id) => {
    if (!id)
        return undefined;
    if (id instanceof mongoose_1.Types.ObjectId)
        return id;
    const str = String(id);
    return mongoose_1.Types.ObjectId.isValid(str) ? new mongoose_1.Types.ObjectId(str) : undefined;
};
const deriveEvent = (fromStatus, toStatus, amountDelta, source) => {
    if (fromStatus !== toStatus) {
        if (toStatus === "refunded")
            return "refund";
        if (toStatus === "failed")
            return "payment_failed";
    }
    if (source === "gateway" && amountDelta > 0)
        return "payment_received";
    if (fromStatus !== toStatus)
        return "status_change";
    return "amount_adjusted";
};
/**
 * Record a change to an entity's payment state. Writes nothing when neither
 * the status nor the amount paid moved (unless an event is forced), so
 * no-op saves don't clutter the history.
 *
 * Best effort: a failed log write is reported but never thrown, so it can't
 * break an admin save or a gateway callback that already succeeded.
 */
const logPaymentChange = async (input) => {
    try {
        const fromStatus = input.before.paymentStatus;
        const toStatus = input.after.paymentStatus;
        const amountPaidBefore = toTwoDecimals(input.before.amountPaid ?? 0);
        const amountPaidAfter = toTwoDecimals(input.after.amountPaid ?? 0);
        const amountDelta = toTwoDecimals(amountPaidAfter - amountPaidBefore);
        const changed = fromStatus !== toStatus || Math.abs(amountDelta) >= 0.01;
        if (!changed && !input.event)
            return;
        await payment_log_model_1.PaymentLog.create({
            entityType: input.entityType,
            entityId: toObjectId(input.entityId),
            entityLabel: input.entityLabel,
            event: input.event ??
                deriveEvent(fromStatus, toStatus, amountDelta, input.source),
            fromStatus,
            toStatus,
            amount: amountDelta,
            amountPaidBefore,
            amountPaidAfter,
            method: input.method,
            transactionId: input.transactionId || undefined,
            source: input.source,
            performedBy: toObjectId(input.performedBy),
            note: input.note,
        });
    }
    catch (error) {
        console.error("Failed to write payment log:", {
            entityType: input.entityType,
            entityId: String(input.entityId),
            error,
        });
    }
};
const orderPaymentSnapshot = (order) => ({
    paymentStatus: order?.paymentStatus,
    amountPaid: order?.amountPaid ?? 0,
});
// Sales have no partial payments: the full total counts as paid only while
// the status is "paid".
const salePaymentSnapshot = (sale) => ({
    paymentStatus: sale?.paymentStatus,
    amountPaid: sale?.paymentStatus === "paid" ? sale?.totalPrice ?? 0 : 0,
});
const logOrderPaymentChange = (before, order, options) => logPaymentChange({
    entityType: "order",
    entityId: order._id,
    entityLabel: order.invoiceSerial || order.orderNumber,
    before,
    after: orderPaymentSnapshot(order),
    ...options,
    method: options.method ?? order.paymentMethod,
});
const logSalePaymentChange = (before, sale, options) => logPaymentChange({
    entityType: "printing-sale",
    entityId: sale._id,
    entityLabel: sale.invoiceSerial || sale.saleNumber,
    before,
    after: salePaymentSnapshot(sale),
    ...options,
    method: options.method ?? "manual",
});
const getPaymentLogsForEntity = async (entityType, entityId) => {
    const id = toObjectId(entityId);
    if (!id)
        return [];
    return payment_log_model_1.PaymentLog.find({ entityType, entityId: id })
        .sort({ createdAt: -1, _id: -1 })
        .populate("performedBy", "firstName lastName email")
        .lean();
};
exports.PaymentLogServices = {
    logPaymentChange,
    logOrderPaymentChange,
    logSalePaymentChange,
    orderPaymentSnapshot,
    salePaymentSnapshot,
    getPaymentLogsForEntity,
};
//# sourceMappingURL=payment-log.service.js.map