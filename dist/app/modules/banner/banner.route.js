"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const banner_validation_1 = require("./banner.validation");
const banner_controller_1 = require("./banner.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Public routes
router.get("/active", banner_controller_1.BannerController.getActiveBanners);
// Protected routes (Admin only)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), (0, validateRequest_1.default)(banner_validation_1.BannerValidation.createBannerValidationSchema), banner_controller_1.BannerController.createBanner);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), banner_controller_1.BannerController.getAllBanners);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), banner_controller_1.BannerController.getSingleBanner);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), (0, validateRequest_1.default)(banner_validation_1.BannerValidation.updateBannerValidationSchema), banner_controller_1.BannerController.updateBanner);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), banner_controller_1.BannerController.deleteBanner);
router.patch("/:id/toggle-status", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), banner_controller_1.BannerController.toggleBannerStatus);
exports.BannerRoutes = router;
//# sourceMappingURL=banner.route.js.map