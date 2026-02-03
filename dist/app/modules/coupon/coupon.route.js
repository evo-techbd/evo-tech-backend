"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Admin routes (protected)
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.createCoupon);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.getAllCoupons);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.getCouponById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.updateCoupon);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.deleteCoupon);
router.get('/:id/stats', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.getCouponStats);
// User routes (for applying coupons during checkout)
router.post('/validate', (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.validateCoupon);
router.post('/apply', (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), coupon_controller_1.CouponController.applyCoupon);
exports.CouponRoutes = router;
//# sourceMappingURL=coupon.route.js.map