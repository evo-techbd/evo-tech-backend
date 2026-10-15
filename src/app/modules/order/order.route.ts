import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { PaymentLogControllers } from "../payment-log/payment-log.controller";

const router = express.Router();

// Public routes - no auth required
router.post("/guest", OrderControllers.placeGuestOrder);
router.get("/track/:trackingCode", OrderControllers.trackOrder);

// User routes
router.post(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.placeOrder
);
router.post(
  "/link-guest-orders",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.linkGuestOrders
);
router.get(
  "/my-orders",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.getUserOrders
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  OrderControllers.getAllOrders
);
router.get(
  "/archive/summary",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  OrderControllers.getOrderArchiveSummary
);
router.get(
  "/archive/years",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  OrderControllers.getOrderArchiveYears
);
router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.getSingleOrder
);
router.get(
  "/:id/items-for-review",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.getOrderItemsForReview
);
router.get(
  "/:id/payment-logs",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PaymentLogControllers.getOrderPaymentLogs
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  OrderControllers.updateOrderStatus
);
router.delete("/:id", auth(USER_ROLE.ADMIN), OrderControllers.deleteOrder);

export const OrderRoutes = router;
