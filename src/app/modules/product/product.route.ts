import express from "express";
import { ProductControllers } from "./product.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

// Featured Sections (Homepage Sections) - MUST be before /:id routes
router.get("/featured-sections", ProductControllers.getAllFeaturedSections);
router.post(
  "/featured-sections",
  auth(USER_ROLE.ADMIN),
  ProductControllers.createFeaturedSection
);
router.patch(
  "/featured-sections/:id",
  auth(USER_ROLE.ADMIN),
  ProductControllers.updateFeaturedSection
);
router.delete(
  "/featured-sections/:id",
  auth(USER_ROLE.ADMIN),
  ProductControllers.deleteFeaturedSection
);

// Product CRUD
router.get("/", ProductControllers.getAllProducts);
router.get("/colors/unique", ProductControllers.getAllUniqueColors);
router.get("/slug/:slug", ProductControllers.getProductBySlug);
router.get("/:id", ProductControllers.getSingleProduct);
router.post(
  "/",
  (req, res, next) => {
    console.log("🔵 [ROUTE] POST /products - Starting middleware chain");
    console.log("📦 Content-Type:", req.headers["content-type"]);
    console.log("📏 Content-Length:", req.headers["content-length"]);
    next();
  },
  auth(USER_ROLE.ADMIN),
  (req, res, next) => {
    console.log("✅ [ROUTE] Auth passed");
    next();
  },
  (req, res, next) => {
    console.log("🔄 [ROUTE] Before multer - about to process upload");
    next();
  },
  multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  (req, res, next) => {
    console.log("✅ [ROUTE] Multer passed successfully!");
    next();
  },
  parseBody,
  (req, res, next) => {
    console.log("✅ [ROUTE] ParseBody passed, calling controller");
    next();
  },
  ProductControllers.createProduct
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
  ]),
  parseBody,
  ProductControllers.updateProduct
);
router.delete("/:id", auth(USER_ROLE.ADMIN), ProductControllers.deleteProduct);

// Product Images
router.get("/:productId/images", ProductControllers.getProductImages);
router.post(
  "/:productId/images",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.addProductImage
);
router.delete(
  "/images/:imageId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.deleteProductImage
);

// Feature Headers
router.get("/:productId/feature-headers", ProductControllers.getFeatureHeaders);
router.post(
  "/:productId/feature-headers",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.single("bannerImage"),
  parseBody,
  ProductControllers.addFeatureHeader
);
router.put(
  "/feature-headers/:headerId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.updateFeatureHeader
);
router.delete(
  "/feature-headers/:headerId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.deleteFeatureHeader
);

// Feature Subsections
router.get(
  "/:productId/feature-subsections",
  ProductControllers.getFeatureSubsections
);
router.post(
  "/:productId/feature-subsections",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.addFeatureSubsection
);
router.put(
  "/feature-subsections/:subsectionId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.updateFeatureSubsection
);
router.delete(
  "/feature-subsections/:subsectionId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.deleteFeatureSubsection
);

// Specifications
router.get("/:productId/specifications", ProductControllers.getSpecifications);
router.post(
  "/:productId/specifications",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.addSpecification
);
router.put(
  "/specifications/:specId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.updateSpecification
);
router.delete(
  "/specifications/:specId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.deleteSpecification
);

// Color Variations
router.get(
  "/:productId/color-variations",
  ProductControllers.getColorVariations
);
router.post(
  "/:productId/color-variations",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.addColorVariation
);
router.put(
  "/color-variations/:colorId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.updateColorVariation
);
router.delete(
  "/color-variations/:colorId",
  auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE),
  ProductControllers.deleteColorVariation
);

export const ProductRoutes = router;
