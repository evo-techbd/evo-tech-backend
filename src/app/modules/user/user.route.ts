import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

// User dashboard routes
router.get("/dashboard/stats", auth(USER_ROLE.USER), UserControllers.getUserDashboardStats);
router.get("/dashboard/orders", auth(USER_ROLE.USER), UserControllers.getUserOrders);

// Admin staff management routes
router.post("/staff", auth(USER_ROLE.ADMIN), UserControllers.createStaff);

// Admin user management routes
router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.get("/:id", UserControllers.getSingleUser);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE, USER_ROLE.USER),
  UserControllers.updateUser
);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
