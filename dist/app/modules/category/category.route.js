"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.get("/", category_controller_1.CategoryControllers.getAllCategories);
router.get("/slug/:slug", category_controller_1.CategoryControllers.getCategoryBySlug);
router.get("/:id", category_controller_1.CategoryControllers.getSingleCategory);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, category_controller_1.CategoryControllers.createCategory);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, category_controller_1.CategoryControllers.updateCategory);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), category_controller_1.CategoryControllers.deleteCategory);
exports.CategoryRoutes = router;
//# sourceMappingURL=category.route.js.map