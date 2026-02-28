"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPointRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const pickuppoint_validation_1 = require("./pickuppoint.validation");
const pickuppoint_controller_1 = require("./pickuppoint.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", pickuppoint_controller_1.PickupPointController.getActivePickupPoints);
// Protected routes (Admin only)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(pickuppoint_validation_1.PickupPointValidation.createPickupPointValidationSchema), pickuppoint_controller_1.PickupPointController.createPickupPoint);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), pickuppoint_controller_1.PickupPointController.getAllPickupPoints);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), pickuppoint_controller_1.PickupPointController.getSinglePickupPoint);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(pickuppoint_validation_1.PickupPointValidation.updatePickupPointValidationSchema), pickuppoint_controller_1.PickupPointController.updatePickupPoint);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), pickuppoint_controller_1.PickupPointController.deletePickupPoint);
router.patch("/:id/toggle-status", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), pickuppoint_controller_1.PickupPointController.togglePickupPointStatus);
exports.PickupPointRoutes = router;
//# sourceMappingURL=pickuppoint.route.js.map