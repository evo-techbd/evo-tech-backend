"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.registerValidation), auth_controller_1.AuthControllers.registerUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidation), auth_controller_1.AuthControllers.loginUser);
router.post("/oauth", auth_controller_1.AuthControllers.handleOAuthLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.refreshToken);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/forgot-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.forgotPasswordValidation), auth_controller_1.AuthControllers.forgotPassword);
router.post("/reset-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.resetPasswordValidation), auth_controller_1.AuthControllers.resetPassword);
router.get("/me", (0, auth_1.default)(), auth_controller_1.AuthControllers.getCurrentUser);
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map