import express from "express";
import { BrandControllers } from "./brand.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.get("/", BrandControllers.getAllBrands);
router.get("/slug/:slug", BrandControllers.getBrandBySlug);
router.get("/:id", BrandControllers.getSingleBrand);
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("logo"),
  parseBody,
  BrandControllers.createBrand
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("logo"),
  parseBody,
  BrandControllers.updateBrand
);
router.delete("/:id", auth(USER_ROLE.ADMIN), BrandControllers.deleteBrand);

export const BrandRoutes = router;
