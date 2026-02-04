"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const coupon_model_1 = require("./coupon.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Create new coupon
const createCoupon = async (couponData) => {
    // Check if coupon code already exists
    const existingCoupon = await coupon_model_1.Coupon.findOne({
        code: couponData.code?.toUpperCase(),
    });
    if (existingCoupon) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Coupon code '${couponData.code?.toUpperCase()}' already exists. Please use a different code.`);
    }
    // Validate dates
    if (couponData.validFrom && couponData.validUntil) {
        if (new Date(couponData.validFrom) >= new Date(couponData.validUntil)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Valid from date must be before valid until date");
        }
    }
    // Validate discount value
    if (couponData.discountType === "percentage" &&
        couponData.discountValue > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Percentage discount cannot exceed 100%");
    }
    const coupon = await coupon_model_1.Coupon.create(couponData);
    return coupon;
};
// Get all coupons with filters
const getAllCoupons = async (query) => {
    const { page = 1, limit = 10, search, isActive, discountType, sortBy = "createdAt", sortOrder = "desc", } = query;
    const filter = {};
    if (search) {
        filter.$or = [
            { code: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }
    if (discountType) {
        filter.discountType = discountType;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    const [coupons, total] = await Promise.all([
        coupon_model_1.Coupon.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "firstName lastName email")
            .lean(),
        coupon_model_1.Coupon.countDocuments(filter),
    ]);
    return {
        coupons,
        meta: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
        },
    };
};
// Get single coupon by ID
const getCouponById = async (id) => {
    const coupon = await coupon_model_1.Coupon.findById(id)
        .populate("createdBy", "firstName lastName email")
        .populate("applicableCategories", "name slug")
        .populate("applicableProducts", "name slug")
        .populate("excludedCategories", "name slug")
        .populate("excludedProducts", "name slug");
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
};
// Get coupon by code (for applying)
const getCouponByCode = async (code) => {
    const coupon = await coupon_model_1.Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid coupon code");
    }
    // Check if coupon is still valid
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon has expired or not yet valid");
    }
    // Check if usage limit reached
    if (coupon.currentUsageCount >= coupon.maxUsageCount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon usage limit reached");
    }
    return coupon;
};
// Validate coupon for user and order
const validateCoupon = async (code, userId, orderAmount) => {
    const coupon = await getCouponByCode(code);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    // Check minimum order amount
    if (coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Minimum order amount of BDT ${coupon.minimumOrderAmount} required`);
    }
    // Check if user already used this coupon (if not reusable)
    if (!coupon.isReusable) {
        const existingUsage = await coupon_model_1.CouponUsage.findOne({
            couponId: coupon._id,
            userId: userId,
        });
        if (existingUsage) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already used this coupon");
        }
    }
    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
        discountAmount = (orderAmount * coupon.discountValue) / 100;
        if (coupon.maximumDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
        }
    }
    else {
        discountAmount = coupon.discountValue;
    }
    return {
        coupon,
        discountAmount: Math.min(discountAmount, orderAmount),
    };
};
// Apply coupon (record usage)
const applyCoupon = async (code, userId, orderId, discountApplied) => {
    const coupon = await coupon_model_1.Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    // Record usage
    await coupon_model_1.CouponUsage.create({
        couponId: coupon._id,
        userId,
        orderId,
        discountApplied,
    });
    // Increment usage count
    await coupon_model_1.Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { currentUsageCount: 1 },
    });
    return { success: true, message: "Coupon applied successfully" };
};
// Update coupon
const updateCoupon = async (id, updateData) => {
    // Validate dates if being updated
    if (updateData.validFrom && updateData.validUntil) {
        if (new Date(updateData.validFrom) >= new Date(updateData.validUntil)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Valid from date must be before valid until date");
        }
    }
    // Validate discount value
    if (updateData.discountType === "percentage" &&
        updateData.discountValue > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Percentage discount cannot exceed 100%");
    }
    const coupon = await coupon_model_1.Coupon.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
};
// Delete coupon
const deleteCoupon = async (id) => {
    const coupon = await coupon_model_1.Coupon.findByIdAndDelete(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    // Also delete usage records
    await coupon_model_1.CouponUsage.deleteMany({ couponId: id });
};
// Get coupon usage statistics
const getCouponStats = async (id) => {
    const coupon = await coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    const usageRecords = await coupon_model_1.CouponUsage.find({ couponId: id })
        .populate("userId", "firstName lastName email")
        .populate("orderId", "orderNumber totalPayable")
        .sort({ usedAt: -1 });
    const totalDiscountGiven = usageRecords.reduce((sum, usage) => sum + usage.discountApplied, 0);
    return {
        coupon,
        usageRecords,
        stats: {
            totalUsages: coupon.currentUsageCount,
            remainingUsages: coupon.maxUsageCount - coupon.currentUsageCount,
            totalDiscountGiven,
            uniqueUsers: new Set(usageRecords.map((r) => r.userId.toString())).size,
        },
    };
};
exports.CouponService = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    getCouponByCode,
    validateCoupon,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponStats,
};
//# sourceMappingURL=coupon.service.js.map