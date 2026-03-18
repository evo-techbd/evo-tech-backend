import express from "express";
import { DashboardControllers } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin dashboard routes
router.get(
  "/stats",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getDashboardStats
);

router.get(
  "/sales-data",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getSalesData
);

router.get(
  "/recent-orders",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getRecentOrders
);

router.get(
  "/top-products",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getTopProducts
);

router.get(
  "/earnings-report",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getEarningsReport
);

router.get(
  "/pending-orders-count",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getPendingOrdersCount
);

router.get(
  "/monthly-profit-breakdown",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getMonthlyProfitBreakdown
);

router.get(
  "/orders-with-profit",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  DashboardControllers.getOrdersWithProfit
);

export const DashboardRoutes = router;