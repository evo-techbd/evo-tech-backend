"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintPricingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const print_pricing_controller_1 = require("./print-pricing.controller");
const print_pricing_validation_1 = require("./print-pricing.validation");
const router = express_1.default.Router();
// Public route - used by the 3D printing page calculator
router.get("/", print_pricing_controller_1.PrintPricingController.getPublicPricing);
// Admin/Employee only
router.get("/settings", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), print_pricing_controller_1.PrintPricingController.getPricingSettings);
router.patch("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(print_pricing_validation_1.PrintPricingValidation.updatePricingValidationSchema), print_pricing_controller_1.PrintPricingController.updatePricingSettings);
exports.PrintPricingRoutes = router;
//# sourceMappingURL=print-pricing.route.js.map