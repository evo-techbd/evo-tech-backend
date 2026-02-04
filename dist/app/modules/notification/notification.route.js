"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.get("/stock", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), notification_controller_1.NotificationControllers.getStockNotifications);
router.patch("/:id/read", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), notification_controller_1.NotificationControllers.markNotificationAsRead);
router.patch("/:id/resolve", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), notification_controller_1.NotificationControllers.resolveNotification);
exports.NotificationRoutes = router;
//# sourceMappingURL=notification.route.js.map