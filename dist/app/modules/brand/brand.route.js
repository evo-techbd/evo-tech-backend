"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("./brand.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.get("/", brand_controller_1.BrandControllers.getAllBrands);
router.get("/slug/:slug", brand_controller_1.BrandControllers.getBrandBySlug);
router.get("/:id", brand_controller_1.BrandControllers.getSingleBrand);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("logo"), bodyParser_1.parseBody, brand_controller_1.BrandControllers.createBrand);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("logo"), bodyParser_1.parseBody, brand_controller_1.BrandControllers.updateBrand);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), brand_controller_1.BrandControllers.deleteBrand);
exports.BrandRoutes = router;
//# sourceMappingURL=brand.route.js.map