import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { ProductGroupValidation } from "./product-group.validation";
import { ProductGroupController } from "./product-group.controller";

const router = express.Router();

// Public route - MUST be before /:id
router.get("/by-product/:productId", ProductGroupController.getGroupForProduct);

// Admin routes
router.get("/", auth(USER_ROLE.ADMIN), ProductGroupController.getAllProductGroups);

router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(ProductGroupValidation.createProductGroupValidationSchema),
  ProductGroupController.createProductGroup,
);

router.get("/:id", auth(USER_ROLE.ADMIN), ProductGroupController.getSingleProductGroup);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN),
  validateRequest(ProductGroupValidation.updateProductGroupValidationSchema),
  ProductGroupController.updateProductGroup,
);

router.delete("/:id", auth(USER_ROLE.ADMIN), ProductGroupController.deleteProductGroup);

export const ProductGroupRoutes = router;
