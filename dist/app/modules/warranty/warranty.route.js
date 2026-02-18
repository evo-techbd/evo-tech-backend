"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarrantyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const warranty_validation_1 = require("./warranty.validation");
const warranty_controller_1 = require("./warranty.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", warranty_controller_1.WarrantyController.getActiveWarranty);
// Protected routes (Admin and Employee with proper permissions)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(warranty_validation_1.WarrantyValidation.createWarrantyValidationSchema), warranty_controller_1.WarrantyController.createOrUpdateWarranty);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), warranty_controller_1.WarrantyController.getAllWarranty);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), warranty_controller_1.WarrantyController.getSingleWarranty);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(warranty_validation_1.WarrantyValidation.updateWarrantyValidationSchema), warranty_controller_1.WarrantyController.updateWarranty);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), warranty_controller_1.WarrantyController.deleteWarranty);
exports.WarrantyRoutes = router;
//# sourceMappingURL=warranty.route.js.map