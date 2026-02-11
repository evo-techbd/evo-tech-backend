import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FaqValidation } from "./faq.validation";
import { FaqController } from "./faq.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", FaqController.getActiveFaqs);

// Protected routes (Admin and Employee)
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(FaqValidation.createFaqValidationSchema),
  FaqController.createFaq
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  FaqController.getAllFaqs
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  FaqController.getSingleFaq
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(FaqValidation.updateFaqValidationSchema),
  FaqController.updateFaq
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  FaqController.deleteFaq
);

export const FaqRoutes = router;
