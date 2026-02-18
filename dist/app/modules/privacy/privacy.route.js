"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const privacy_validation_1 = require("./privacy.validation");
const privacy_controller_1 = require("./privacy.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", privacy_controller_1.PrivacyController.getActivePrivacy);
// Protected routes (Admin and Employee with proper permissions)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(privacy_validation_1.PrivacyValidation.createPrivacyValidationSchema), privacy_controller_1.PrivacyController.createOrUpdatePrivacy);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), privacy_controller_1.PrivacyController.getAllPrivacy);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), privacy_controller_1.PrivacyController.getSinglePrivacy);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(privacy_validation_1.PrivacyValidation.updatePrivacyValidationSchema), privacy_controller_1.PrivacyController.updatePrivacy);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), privacy_controller_1.PrivacyController.deletePrivacy);
exports.PrivacyRoutes = router;
//# sourceMappingURL=privacy.route.js.map