import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PageContentValidation } from "./page-content.validation";
import { PageContentController } from "./page-content.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.get("/:type/active", PageContentController.getActivePageContent);

// Protected routes (Admin and Employee)
router.post(
  "/:type",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(PageContentValidation.createPageContentValidationSchema),
  PageContentController.createPageContent
);

router.get(
  "/:type",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PageContentController.getAllPageContent
);

router.get(
  "/:type/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PageContentController.getSinglePageContent
);

router.patch(
  "/:type/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  validateRequest(PageContentValidation.updatePageContentValidationSchema),
  PageContentController.updatePageContent
);

router.delete(
  "/:type/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  PageContentController.deletePageContent
);

export const PageContentRoutes = router;
