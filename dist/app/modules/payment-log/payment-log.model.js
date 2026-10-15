"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLog = void 0;
const mongoose_1 = require("mongoose");
const paymentLogSchema = new mongoose_1.Schema({
    entityType: {
        type: String,
        enum: ["order", "printing-sale"],
        required: true,
    },
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    entityLabel: { type: String },
    event: {
        type: String,
        enum: [
            "created",
            "status_change",
            "payment_received",
            "payment_failed",
            "refund",
            "amount_adjusted",
        ],
        required: true,
    },
    fromStatus: { type: String },
    toStatus: { type: String },
    amount: { type: Number },
    amountPaidBefore: { type: Number },
    amountPaidAfter: { type: Number },
    method: { type: String },
    transactionId: { type: String },
    source: {
        type: String,
        enum: ["admin", "gateway", "system"],
        required: true,
    },
    performedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    note: { type: String },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
// One entity's history, newest first
paymentLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
// Finance reporting: e.g. all payments received in a period
paymentLogSchema.index({ event: 1, createdAt: -1 });
exports.PaymentLog = (0, mongoose_1.model)("PaymentLog", paymentLogSchema);
//# sourceMappingURL=payment-log.model.js.map