"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subcategory_controller_1 = require("./subcategory.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.get("/", subcategory_controller_1.SubcategoryControllers.getAllSubcategories);
router.get("/slug/:slug", subcategory_controller_1.SubcategoryControllers.getSubcategoryBySlug);
router.get("/:id", subcategory_controller_1.SubcategoryControllers.getSingleSubcategory);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, subcategory_controller_1.SubcategoryControllers.createSubcategory);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, subcategory_controller_1.SubcategoryControllers.updateSubcategory);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), subcategory_controller_1.SubcategoryControllers.deleteSubcategory);
exports.SubcategoryRoutes = router;
//# sourceMappingURL=subcategory.route.js.map