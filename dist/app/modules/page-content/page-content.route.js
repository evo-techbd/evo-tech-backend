"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const page_content_validation_1 = require("./page-content.validation");
const page_content_controller_1 = require("./page-content.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/:type/active", page_content_controller_1.PageContentController.getActivePageContent);
// Protected routes (Admin and Employee)
router.post("/:type", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(page_content_validation_1.PageContentValidation.createPageContentValidationSchema), page_content_controller_1.PageContentController.createPageContent);
router.get("/:type", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), page_content_controller_1.PageContentController.getAllPageContent);
router.get("/:type/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), page_content_controller_1.PageContentController.getSinglePageContent);
router.patch("/:type/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(page_content_validation_1.PageContentValidation.updatePageContentValidationSchema), page_content_controller_1.PageContentController.updatePageContent);
router.delete("/:type/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), page_content_controller_1.PageContentController.deletePageContent);
exports.PageContentRoutes = router;
//# sourceMappingURL=page-content.route.js.map