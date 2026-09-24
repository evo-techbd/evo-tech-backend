import express from "express";
import { PaymentControllers } from "./payment.controller";
import { EpsControllers } from "./eps.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Guest bKash payment (no auth required)
router.post(
  "/bkash/create/guest",
  PaymentControllers.createBkashPayment
);

// Create payment (requires authentication for user orders)
router.post(
  "/bkash/create",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PaymentControllers.createBkashPayment
);

// Execute payment (requires authentication)
router.post(
  "/bkash/execute",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PaymentControllers.executeBkashPayment
);

// Query payment status (requires authentication)
router.get(
  "/bkash/query/:paymentID",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  PaymentControllers.queryBkashPayment
);

// Callback handler (no auth required - called by bKash)
router.get("/bkash/callback", PaymentControllers.handleBkashCallback);

// Webhook handler (no auth required - called by bKash)
router.post("/bkash/webhook", PaymentControllers.handleBkashWebhook);

// EPS gateway. Guests pay too, so no auth: an order ID only lets the caller
// start a payment for that order's own outstanding amount.
router.post("/eps/initiate", EpsControllers.initiateEpsPayment);
router.post("/eps/verify", EpsControllers.verifyEpsPayment);

// Browser return from EPS; the gateway may use GET or POST. Params are
// validated in the handler (inline route regexes are unreliable in Express).
const epsCallbackPath = "/eps/callback/:outcome/:merchantTransactionId";
router.get(epsCallbackPath, EpsControllers.handleEpsCallback);
router.post(epsCallbackPath, EpsControllers.handleEpsCallback);

export const PaymentRoutes = router;
