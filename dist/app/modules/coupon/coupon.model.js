"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsage = exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const CouponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minimumOrderAmount: {
        type: Number,
        default: 0,
    },
    maximumDiscountAmount: {
        type: Number,
        default: null,
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    maxUsageCount: {
        type: Number,
        required: true,
        min: 1,
    },
    currentUsageCount: {
        type: Number,
        default: 0,
    },
    isReusable: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        trim: true,
    },
    applicableCategories: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    applicableProducts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    excludedCategories: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    excludedProducts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
// Index for efficient queries
CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });
const CouponUsageSchema = new mongoose_1.Schema({
    couponId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    discountApplied: {
        type: Number,
        required: true,
    },
    usedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Compound index for checking user usage
CouponUsageSchema.index({ couponId: 1, userId: 1 });
exports.Coupon = (0, mongoose_1.model)('Coupon', CouponSchema);
exports.CouponUsage = (0, mongoose_1.model)('CouponUsage', CouponUsageSchema);
//# sourceMappingURL=coupon.model.js.map