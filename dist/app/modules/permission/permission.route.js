"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const permission_controller_1 = require("./permission.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Get all available permissions (admin only)
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), permission_controller_1.PermissionControllers.getAllPermissions);
// Get my permissions (for logged-in staff/admin)
router.get("/my-permissions", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), permission_controller_1.PermissionControllers.getMyPermissions);
// Get permitted routes (lightweight for auth)
router.get("/my-routes", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), permission_controller_1.PermissionControllers.getPermittedRoutes);
// Get specific staff permissions (admin only)
router.get("/staff/:userUuid", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), permission_controller_1.PermissionControllers.getStaffPermissions);
// Assign permissions to staff (admin only)
router.put("/staff/:userUuid", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), permission_controller_1.PermissionControllers.assignPermissions);
exports.PermissionRoutes = router;
//# sourceMappingURL=permission.route.js.map