"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Guest bKash payment (no auth required)
router.post("/bkash/create/guest", payment_controller_1.PaymentControllers.createBkashPayment);
// Create payment (requires authentication for user orders)
router.post("/bkash/create", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), payment_controller_1.PaymentControllers.createBkashPayment);
// Execute payment (requires authentication)
router.post("/bkash/execute", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), payment_controller_1.PaymentControllers.executeBkashPayment);
// Query payment status (requires authentication)
router.get("/bkash/query/:paymentID", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), payment_controller_1.PaymentControllers.queryBkashPayment);
// Callback handler (no auth required - called by bKash)
router.get("/bkash/callback", payment_controller_1.PaymentControllers.handleBkashCallback);
// Webhook handler (no auth required - called by bKash)
router.post("/bkash/webhook", payment_controller_1.PaymentControllers.handleBkashWebhook);
exports.PaymentRoutes = router;
//# sourceMappingURL=payment.route.js.map