import express from 'express';
import { CouponController } from './coupon.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Admin routes (protected)
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  CouponController.createCoupon
);

router.get(
  '/',
  auth(USER_ROLE.ADMIN),
  CouponController.getAllCoupons
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN),
  CouponController.getCouponById
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  CouponController.updateCoupon
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  CouponController.deleteCoupon
);

router.get(
  '/:id/stats',
  auth(USER_ROLE.ADMIN),
  CouponController.getCouponStats
);

// User routes (for applying coupons during checkout)
router.post(
  '/validate',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CouponController.validateCoupon
);

router.post(
  '/apply',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  CouponController.applyCoupon
);

export const CouponRoutes = router;
