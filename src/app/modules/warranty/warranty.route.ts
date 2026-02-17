import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WarrantyValidation } from "./warranty.validation";
import { WarrantyController } from "./warranty.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", WarrantyController.getActiveWarranty);

// Protected routes (Admin and Employee with proper permissions)
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(WarrantyValidation.createWarrantyValidationSchema),
  WarrantyController.createOrUpdateWarranty
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), WarrantyController.getAllWarranty);

router.get("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), WarrantyController.getSingleWarranty);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(WarrantyValidation.updateWarrantyValidationSchema),
  WarrantyController.updateWarranty
);

router.delete("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), WarrantyController.deleteWarranty);

export const WarrantyRoutes = router;
