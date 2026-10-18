import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { PrintPricingController } from "./print-pricing.controller";
import { PrintPricingValidation } from "./print-pricing.validation";

const router = express.Router();

// Public route - used by the 3D printing page calculator
router.get("/", PrintPricingController.getPublicPricing);

// Admin/Employee only
router.get(
  "/settings",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PrintPricingController.getPricingSettings,
);
router.patch(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(PrintPricingValidation.updatePricingValidationSchema),
  PrintPricingController.updatePricingSettings,
);

export const PrintPricingRoutes = router;
