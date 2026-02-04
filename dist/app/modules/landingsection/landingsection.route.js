"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingSectionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const landingsection_validation_1 = require("./landingsection.validation");
const landingsection_controller_1 = require("./landingsection.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get("/active", landingsection_controller_1.LandingSectionController.getActiveLandingSections);
// Protected routes (Admin only)
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(landingsection_validation_1.LandingSectionValidation.createLandingSectionValidationSchema), landingsection_controller_1.LandingSectionController.createLandingSection);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), landingsection_controller_1.LandingSectionController.getAllLandingSections);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), landingsection_controller_1.LandingSectionController.getSingleLandingSection);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(landingsection_validation_1.LandingSectionValidation.updateLandingSectionValidationSchema), landingsection_controller_1.LandingSectionController.updateLandingSection);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), landingsection_controller_1.LandingSectionController.deleteLandingSection);
router.patch("/:id/toggle-status", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), landingsection_controller_1.LandingSectionController.toggleLandingSectionStatus);
exports.LandingSectionRoutes = router;
//# sourceMappingURL=landingsection.route.js.map