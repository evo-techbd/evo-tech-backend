"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes - no auth required
router.post("/guest", order_controller_1.OrderControllers.placeGuestOrder);
router.get("/track/:trackingCode", order_controller_1.OrderControllers.trackOrder);
// User routes
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.placeOrder);
router.post("/link-guest-orders", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.linkGuestOrders);
router.get("/my-orders", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.getUserOrders);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), order_controller_1.OrderControllers.getAllOrders);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.getSingleOrder);
router.get("/:id/items-for-review", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.getOrderItemsForReview);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), order_controller_1.OrderControllers.updateOrderStatus);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderControllers.deleteOrder);
exports.OrderRoutes = router;
//# sourceMappingURL=order.route.js.map