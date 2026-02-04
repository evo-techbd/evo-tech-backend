import express from "express";
import { SubcategoryControllers } from "./subcategory.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get("/", SubcategoryControllers.getAllSubcategories);
router.get("/slug/:slug", SubcategoryControllers.getSubcategoryBySlug);
router.get("/:id", SubcategoryControllers.getSingleSubcategory);
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  SubcategoryControllers.createSubcategory
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  SubcategoryControllers.updateSubcategory
);
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN),
  SubcategoryControllers.deleteSubcategory
);

export const SubcategoryRoutes = router;
