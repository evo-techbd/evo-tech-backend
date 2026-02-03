"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const terms_validation_1 = require("./terms.validation");
const terms_controller_1 = require("./terms.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", terms_controller_1.TermsController.getActiveTerms);
// Protected routes (Admin and Employee with proper permissions)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(terms_validation_1.TermsValidation.createTermsValidationSchema), terms_controller_1.TermsController.createOrUpdateTerms);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), terms_controller_1.TermsController.getAllTerms);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), terms_controller_1.TermsController.getSingleTerms);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(terms_validation_1.TermsValidation.updateTermsValidationSchema), terms_controller_1.TermsController.updateTerms);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), terms_controller_1.TermsController.deleteTerms);
exports.TermsRoutes = router;
//# sourceMappingURL=terms.route.js.map