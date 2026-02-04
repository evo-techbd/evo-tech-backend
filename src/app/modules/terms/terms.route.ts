import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TermsValidation } from "./terms.validation";
import { TermsController } from "./terms.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/active", TermsController.getActiveTerms);

// Protected routes (Admin and Employee with proper permissions)
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(TermsValidation.createTermsValidationSchema),
  TermsController.createOrUpdateTerms
);

router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), TermsController.getAllTerms);

router.get("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), TermsController.getSingleTerms);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(TermsValidation.updateTermsValidationSchema),
  TermsController.updateTerms
);

router.delete("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), TermsController.deleteTerms);

export const TermsRoutes = router;
