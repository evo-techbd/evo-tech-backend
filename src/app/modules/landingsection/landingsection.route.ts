import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { LandingSectionValidation } from "./landingsection.validation";
import { LandingSectionController } from "./landingsection.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", LandingSectionController.getActiveLandingSections);

// Protected routes (Admin only)
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(
    LandingSectionValidation.createLandingSectionValidationSchema
  ),
  LandingSectionController.createLandingSection
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN),
  LandingSectionController.getAllLandingSections
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN),
  LandingSectionController.getSingleLandingSection
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(
    LandingSectionValidation.updateLandingSectionValidationSchema
  ),
  LandingSectionController.updateLandingSection
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  LandingSectionController.deleteLandingSection
);

router.patch(
  "/:id/toggle-status",
  auth(USER_ROLE.ADMIN),
  LandingSectionController.toggleLandingSectionStatus
);

export const LandingSectionRoutes = router;
