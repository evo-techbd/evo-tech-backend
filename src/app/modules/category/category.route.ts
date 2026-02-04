import express from "express";
import { CategoryControllers } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get("/", CategoryControllers.getAllCategories);
router.get("/slug/:slug", CategoryControllers.getCategoryBySlug);
router.get("/:id", CategoryControllers.getSingleCategory);
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.single("image"),
  parseBody,
  CategoryControllers.createCategory
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  CategoryControllers.updateCategory
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
