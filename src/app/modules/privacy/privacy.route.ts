import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PrivacyValidation } from "./privacy.validation";
import { PrivacyController } from "./privacy.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", PrivacyController.getActivePrivacy);

// Protected routes (Admin and Employee with proper permissions)
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(PrivacyValidation.createPrivacyValidationSchema),
  PrivacyController.createOrUpdatePrivacy
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), PrivacyController.getAllPrivacy);

router.get("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), PrivacyController.getSinglePrivacy);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(PrivacyValidation.updatePrivacyValidationSchema),
  PrivacyController.updatePrivacy
);

router.delete("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), PrivacyController.deletePrivacy);

export const PrivacyRoutes = router;
