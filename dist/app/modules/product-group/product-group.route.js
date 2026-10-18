"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductGroupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const product_group_validation_1 = require("./product-group.validation");
const product_group_controller_1 = require("./product-group.controller");
const router = express_1.default.Router();
// Public route - MUST be before /:id
router.get("/by-product/:productId", product_group_controller_1.ProductGroupController.getGroupForProduct);
// Admin routes
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_group_controller_1.ProductGroupController.getAllProductGroups);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(product_group_validation_1.ProductGroupValidation.createProductGroupValidationSchema), product_group_controller_1.ProductGroupController.createProductGroup);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_group_controller_1.ProductGroupController.getSingleProductGroup);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(product_group_validation_1.ProductGroupValidation.updateProductGroupValidationSchema), product_group_controller_1.ProductGroupController.updateProductGroup);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_group_controller_1.ProductGroupController.deleteProductGroup);
exports.ProductGroupRoutes = router;
//# sourceMappingURL=product-group.route.js.map