import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { CouponService } from './coupon.service';

// Create new coupon
const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const couponData = {
    ...req.body,
    createdBy: req.user?.userId,
  };

  const result = await CouponService.createCoupon(couponData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

// Get all coupons
const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    data: result.coupons,
    meta: result.meta,
  });
});

// Get single coupon by ID
const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.getCouponById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

// Validate coupon (for users during checkout)
const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, orderAmount } = req.body;
  const userId = req.user?.userId;

  const result = await CouponService.validateCoupon(code, userId, orderAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon is valid',
    data: result,
  });
});

// Apply coupon (called after order placement)
const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, orderId, discountApplied } = req.body;
  const userId = req.user?.userId;

  const result = await CouponService.applyCoupon(code, userId, orderId, discountApplied);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

// Update coupon
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.updateCoupon(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

// Delete coupon
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CouponService.deleteCoupon(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: null,
  });
});

// Get coupon statistics
const getCouponStats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponService.getCouponStats(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon statistics retrieved successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  applyCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
};
