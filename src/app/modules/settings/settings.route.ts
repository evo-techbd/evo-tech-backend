import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SettingsValidation } from "./settings.validation";
import { SettingsController } from "./settings.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public route - used by the storefront to calculate checkout totals
router.get("/delivery-charge", SettingsController.getDeliveryChargeSettings);

// Admin/Employee only
router.patch(
  "/delivery-charge",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(SettingsValidation.updateDeliveryChargeValidationSchema),
  SettingsController.updateDeliveryChargeSettings
);

// Public route - contact info shown across the storefront
router.get("/contact", SettingsController.getContactSettings);

// Admin/Employee only
router.patch(
  "/contact",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(SettingsValidation.updateContactSettingsValidationSchema),
  SettingsController.updateContactSettings
);

export const SettingsRoutes = router;
