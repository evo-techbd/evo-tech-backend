"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faq_validation_1 = require("./faq.validation");
const faq_controller_1 = require("./faq.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", faq_controller_1.FaqController.getActiveFaqs);
// Protected routes (Admin and Employee)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(faq_validation_1.FaqValidation.createFaqValidationSchema), faq_controller_1.FaqController.createFaq);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), faq_controller_1.FaqController.getAllFaqs);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), faq_controller_1.FaqController.getSingleFaq);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(faq_validation_1.FaqValidation.updateFaqValidationSchema), faq_controller_1.FaqController.updateFaq);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), faq_controller_1.FaqController.deleteFaq);
exports.FaqRoutes = router;
//# sourceMappingURL=faq.route.js.map