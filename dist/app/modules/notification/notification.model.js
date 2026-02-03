"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["low_stock", "out_of_stock"],
        required: true,
    },
    severity: {
        type: String,
        enum: ["info", "warning", "critical"],
        default: "info",
    },
    status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open",
        index: true,
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        index: true,
    },
    productName: {
        type: String,
    },
    productSlug: {
        type: String,
    },
    currentStock: {
        type: Number,
        default: 0,
    },
    threshold: {
        type: Number,
        default: 0,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
notificationSchema.index({ type: 1, product: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
//# sourceMappingURL=notification.model.js.map