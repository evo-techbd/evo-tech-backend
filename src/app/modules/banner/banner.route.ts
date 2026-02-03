import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BannerValidation } from "./banner.validation";
import { BannerController } from "./banner.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Public routes
router.get("/active", BannerController.getActiveBanners);

// Protected routes (Admin only)
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  validateRequest(BannerValidation.createBannerValidationSchema),
  BannerController.createBanner
);

router.get("/", auth(USER_ROLE.ADMIN), BannerController.getAllBanners);

router.get("/:id", auth(USER_ROLE.ADMIN), BannerController.getSingleBanner);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  validateRequest(BannerValidation.updateBannerValidationSchema),
  BannerController.updateBanner
);

router.delete("/:id", auth(USER_ROLE.ADMIN), BannerController.deleteBanner);

router.patch(
  "/:id/toggle-status",
  auth(USER_ROLE.ADMIN),
  BannerController.toggleBannerStatus
);

export const BannerRoutes = router;
