import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PickupPointValidation } from "./pickuppoint.validation";
import { PickupPointController } from "./pickuppoint.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", PickupPointController.getActivePickupPoints);

// Protected routes (Admin only)
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(PickupPointValidation.createPickupPointValidationSchema),
  PickupPointController.createPickupPoint,
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN),
  PickupPointController.getAllPickupPoints,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN),
  PickupPointController.getSinglePickupPoint,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(PickupPointValidation.updatePickupPointValidationSchema),
  PickupPointController.updatePickupPoint,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  PickupPointController.deletePickupPoint,
);

router.patch(
  "/:id/toggle-status",
  auth(USER_ROLE.ADMIN),
  PickupPointController.togglePickupPointStatus,
);

export const PickupPointRoutes = router;
