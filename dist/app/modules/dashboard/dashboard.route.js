"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Admin dashboard routes
router.get("/stats", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getDashboardStats);
router.get("/sales-data", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getSalesData);
router.get("/recent-orders", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getRecentOrders);
router.get("/top-products", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getTopProducts);
router.get("/earnings-report", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getEarningsReport);
router.get("/pending-orders-count", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), dashboard_controller_1.DashboardControllers.getPendingOrdersCount);
exports.DashboardRoutes = router;
//# sourceMappingURL=dashboard.route.js.map