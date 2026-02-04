import express from "express";
import { PermissionControllers } from "./permission.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Get all available permissions (admin only)
router.get(
  "/",
  auth(USER_ROLE.ADMIN),
  PermissionControllers.getAllPermissions
);

// Get my permissions (for logged-in staff/admin)
router.get(
  "/my-permissions",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PermissionControllers.getMyPermissions
);

// Get permitted routes (lightweight for auth)
router.get(
  "/my-routes",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PermissionControllers.getPermittedRoutes
);

// Get specific staff permissions (admin only)
router.get(
  "/staff/:userUuid",
  auth(USER_ROLE.ADMIN),
  PermissionControllers.getStaffPermissions
);

// Assign permissions to staff (admin only)
router.put(
  "/staff/:userUuid",
  auth(USER_ROLE.ADMIN),
  PermissionControllers.assignPermissions
);

export const PermissionRoutes = router;
