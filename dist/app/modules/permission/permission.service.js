"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionServices = void 0;
const permission_model_1 = require("./permission.model");
const staff_permission_model_1 = require("./staff-permission.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
// Get all permissions
const getAllPermissionsFromDB = async (query) => {
    const { category } = query;
    const searchQuery = { isActive: true };
    if (category) {
        searchQuery.category = category;
    }
    const permissions = await permission_model_1.Permission.find(searchQuery).sort({ category: 1, name: 1 });
    return permissions;
};
// Get permissions for a specific staff member
const getStaffPermissionsFromDB = async (userIdOrUuid) => {
    // Try to find by ObjectId first, then by uuid if not found
    let userId = null;
    if (mongoose_1.Types.ObjectId.isValid(userIdOrUuid)) {
        userId = new mongoose_1.Types.ObjectId(userIdOrUuid);
    }
    else {
        // If not a valid ObjectId, assume it's a UUID and look up the user
        const User = require('../user/user.model').User;
        const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
        if (user) {
            userId = user._id;
        }
    }
    if (!userId) {
        return {
            user: userIdOrUuid,
            permissions: [],
            permittedRoutes: [],
        };
    }
    const staffPermission = await staff_permission_model_1.StaffPermission.findOne({ user: userId });
    if (!staffPermission) {
        return {
            user: userIdOrUuid,
            permissions: [],
            permittedRoutes: [],
        };
    }
    // Get full permission details
    const permissions = await permission_model_1.Permission.find({
        code: { $in: staffPermission.permissions },
        isActive: true,
    });
    // Extract unique routes from permissions
    const permittedRoutes = [...new Set(permissions.map(p => p.route))];
    return {
        user: userIdOrUuid,
        userId: userId.toString(),
        permissions: permissions,
        permissionCodes: staffPermission.permissions,
        permittedRoutes: permittedRoutes, // Array of route strings
        grantedBy: staffPermission.grantedBy,
    };
};
// Assign permissions to staff member
const assignPermissionsToStaff = async (userIdOrUuid, payload) => {
    // Verify all permission codes exist
    const validPermissions = await permission_model_1.Permission.find({
        code: { $in: payload.permissions },
        isActive: true,
    });
    if (validPermissions.length !== payload.permissions.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Some permission codes are invalid");
    }
    // Convert userIdOrUuid to ObjectId
    let userId;
    let grantedById;
    if (mongoose_1.Types.ObjectId.isValid(userIdOrUuid)) {
        userId = new mongoose_1.Types.ObjectId(userIdOrUuid);
    }
    else {
        // Look up user by UUID
        const User = require('../user/user.model').User;
        const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        userId = user._id;
    }
    // Convert grantedBy to ObjectId
    if (mongoose_1.Types.ObjectId.isValid(payload.grantedBy)) {
        grantedById = new mongoose_1.Types.ObjectId(payload.grantedBy);
    }
    else {
        const User = require('../user/user.model').User;
        const admin = await User.findOne({ uuid: payload.grantedBy }).select('_id');
        if (!admin) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Admin user not found");
        }
        grantedById = admin._id;
    }
    // Update or create staff permissions
    const result = await staff_permission_model_1.StaffPermission.findOneAndUpdate({ user: userId }, {
        user: userId,
        permissions: payload.permissions,
        grantedBy: grantedById,
    }, {
        new: true,
        upsert: true,
    });
    return result;
};
// Check if user has specific permission
const checkUserPermission = async (userIdOrUuid, permissionCode) => {
    let userId = null;
    if (mongoose_1.Types.ObjectId.isValid(userIdOrUuid)) {
        userId = new mongoose_1.Types.ObjectId(userIdOrUuid);
    }
    else {
        const User = require('../user/user.model').User;
        const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
        if (user)
            userId = user._id;
    }
    if (!userId)
        return false;
    const staffPermission = await staff_permission_model_1.StaffPermission.findOne({ user: userId });
    if (!staffPermission) {
        return false;
    }
    return staffPermission.permissions.includes(permissionCode);
};
// Check if user has any of the specified permissions
const checkUserHasAnyPermission = async (userIdOrUuid, permissionCodes) => {
    let userId = null;
    if (mongoose_1.Types.ObjectId.isValid(userIdOrUuid)) {
        userId = new mongoose_1.Types.ObjectId(userIdOrUuid);
    }
    else {
        const User = require('../user/user.model').User;
        const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
        if (user)
            userId = user._id;
    }
    if (!userId)
        return false;
    const staffPermission = await staff_permission_model_1.StaffPermission.findOne({ user: userId });
    if (!staffPermission) {
        return false;
    }
    return permissionCodes.some(code => staffPermission.permissions.includes(code));
};
// Get only permitted routes for a user (lightweight for auth)
const getPermittedRoutesForUser = async (userIdOrUuid) => {
    let userId = null;
    if (mongoose_1.Types.ObjectId.isValid(userIdOrUuid)) {
        userId = new mongoose_1.Types.ObjectId(userIdOrUuid);
    }
    else {
        const User = require('../user/user.model').User;
        const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
        if (user) {
            userId = user._id;
        }
    }
    if (!userId) {
        return [];
    }
    const staffPermission = await staff_permission_model_1.StaffPermission.findOne({ user: userId });
    if (!staffPermission) {
        return [];
    }
    // Get permissions and extract routes
    const permissions = await permission_model_1.Permission.find({
        code: { $in: staffPermission.permissions },
        isActive: true,
    }).select('route');
    // Return unique routes
    const routes = [...new Set(permissions.map(p => p.route))];
    return routes;
};
exports.PermissionServices = {
    getAllPermissionsFromDB,
    getStaffPermissionsFromDB,
    assignPermissionsToStaff,
    checkUserPermission,
    checkUserHasAnyPermission,
    getPermittedRoutesForUser,
};
//# sourceMappingURL=permission.service.js.map