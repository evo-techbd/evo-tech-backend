"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
// Featured Sections (Homepage Sections) - MUST be before /:id routes
router.get("/featured-sections", product_controller_1.ProductControllers.getAllFeaturedSections);
router.post("/featured-sections", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.createFeaturedSection);
router.patch("/featured-sections/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.updateFeaturedSection);
router.delete("/featured-sections/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteFeaturedSection);
// Product CRUD
router.get("/", product_controller_1.ProductControllers.getAllProducts);
router.get("/colors/unique", product_controller_1.ProductControllers.getAllUniqueColors);
router.get("/slug/:slug", product_controller_1.ProductControllers.getProductBySlug);
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
router.post("/", (req, res, next) => {
    console.log("🔵 [ROUTE] POST /products - Starting middleware chain");
    console.log("📦 Content-Type:", req.headers["content-type"]);
    console.log("📏 Content-Length:", req.headers["content-length"]);
    next();
}, (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (req, res, next) => {
    console.log("✅ [ROUTE] Auth passed");
    next();
}, (req, res, next) => {
    console.log("🔄 [ROUTE] Before multer - about to process upload");
    next();
}, multer_config_1.multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
]), (req, res, next) => {
    console.log("✅ [ROUTE] Multer passed successfully!");
    next();
}, bodyParser_1.parseBody, (req, res, next) => {
    console.log("✅ [ROUTE] ParseBody passed, calling controller");
    next();
}, product_controller_1.ProductControllers.createProduct);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
]), bodyParser_1.parseBody, product_controller_1.ProductControllers.updateProduct);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteProduct);
// Product Images
router.get("/:productId/images", product_controller_1.ProductControllers.getProductImages);
router.post("/:productId/images", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.addProductImage);
router.delete("/images/:imageId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.deleteProductImage);
// Feature Headers
router.get("/:productId/feature-headers", product_controller_1.ProductControllers.getFeatureHeaders);
router.post("/:productId/feature-headers", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.single("bannerImage"), bodyParser_1.parseBody, product_controller_1.ProductControllers.addFeatureHeader);
router.put("/feature-headers/:headerId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.updateFeatureHeader);
router.delete("/feature-headers/:headerId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.deleteFeatureHeader);
// Feature Subsections
router.get("/:productId/feature-subsections", product_controller_1.ProductControllers.getFeatureSubsections);
router.post("/:productId/feature-subsections", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.addFeatureSubsection);
router.put("/feature-subsections/:subsectionId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.updateFeatureSubsection);
router.delete("/feature-subsections/:subsectionId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.deleteFeatureSubsection);
// Specifications
router.get("/:productId/specifications", product_controller_1.ProductControllers.getSpecifications);
router.post("/:productId/specifications", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.addSpecification);
router.put("/specifications/:specId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.updateSpecification);
router.delete("/specifications/:specId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.deleteSpecification);
// Color Variations
router.get("/:productId/color-variations", product_controller_1.ProductControllers.getColorVariations);
router.post("/:productId/color-variations", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.addColorVariation);
router.put("/color-variations/:colorId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.updateColorVariation);
router.delete("/color-variations/:colorId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), product_controller_1.ProductControllers.deleteColorVariation);
exports.ProductRoutes = router;
//# sourceMappingURL=product.route.js.map