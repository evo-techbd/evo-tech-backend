"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const eps_controller_1 = require("./eps.controller");
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
// EPS gateway. Guests pay too, so no auth: an order ID only lets the caller
// start a payment for that order's own outstanding amount.
router.post("/eps/initiate", eps_controller_1.EpsControllers.initiateEpsPayment);
router.post("/eps/verify", eps_controller_1.EpsControllers.verifyEpsPayment);
// Browser return from EPS; the gateway may use GET or POST. Params are
// validated in the handler (inline route regexes are unreliable in Express).
const epsCallbackPath = "/eps/callback/:outcome/:merchantTransactionId";
router.get(epsCallbackPath, eps_controller_1.EpsControllers.handleEpsCallback);
router.post(epsCallbackPath, eps_controller_1.EpsControllers.handleEpsCallback);
exports.PaymentRoutes = router;
//# sourceMappingURL=payment.route.js.map