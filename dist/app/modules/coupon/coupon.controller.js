"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const coupon_service_1 = require("./coupon.service");
// Create new coupon
const createCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const couponData = {
        ...req.body,
        createdBy: req.user?.userId,
    };
    const result = await coupon_service_1.CouponService.createCoupon(couponData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Coupon created successfully',
        data: result,
    });
});
// Get all coupons
const getAllCoupons = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await coupon_service_1.CouponService.getAllCoupons(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupons retrieved successfully',
        data: result.coupons,
        meta: result.meta,
    });
});
// Get single coupon by ID
const getCouponById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await coupon_service_1.CouponService.getCouponById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupon retrieved successfully',
        data: result,
    });
});
// Validate coupon (for users during checkout)
const validateCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { code, orderAmount } = req.body;
    const userId = req.user?.userId;
    const result = await coupon_service_1.CouponService.validateCoupon(code, userId, orderAmount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupon is valid',
        data: result,
    });
});
// Apply coupon (called after order placement)
const applyCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { code, orderId, discountApplied } = req.body;
    const userId = req.user?.userId;
    const result = await coupon_service_1.CouponService.applyCoupon(code, userId, orderId, discountApplied);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
// Update coupon
const updateCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await coupon_service_1.CouponService.updateCoupon(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupon updated successfully',
        data: result,
    });
});
// Delete coupon
const deleteCoupon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await coupon_service_1.CouponService.deleteCoupon(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupon deleted successfully',
        data: null,
    });
});
// Get coupon statistics
const getCouponStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await coupon_service_1.CouponService.getCouponStats(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Coupon statistics retrieved successfully',
        data: result,
    });
});
exports.CouponController = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    validateCoupon,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponStats,
};
//# sourceMappingURL=coupon.controller.js.map