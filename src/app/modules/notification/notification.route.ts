import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { NotificationControllers } from "./notification.controller";

const router = express.Router();

router.get(
  "/stock",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  NotificationControllers.getStockNotifications
);

router.patch(
  "/:id/read",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  NotificationControllers.markNotificationAsRead
);

router.patch(
  "/:id/resolve",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  NotificationControllers.resolveNotification
);

export const NotificationRoutes = router;
