"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const settings_validation_1 = require("./settings.validation");
const settings_controller_1 = require("./settings.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public route - used by the storefront to calculate checkout totals
router.get("/delivery-charge", settings_controller_1.SettingsController.getDeliveryChargeSettings);
// Admin/Employee only
router.patch("/delivery-charge", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(settings_validation_1.SettingsValidation.updateDeliveryChargeValidationSchema), settings_controller_1.SettingsController.updateDeliveryChargeSettings);
exports.SettingsRoutes = router;
//# sourceMappingURL=settings.route.js.map