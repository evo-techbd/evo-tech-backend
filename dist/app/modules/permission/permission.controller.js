"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const permission_service_1 = require("./permission.service");
const getAllPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await permission_service_1.PermissionServices.getAllPermissionsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permissions retrieved successfully!",
        data: result,
    });
});
const getStaffPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userUuid } = req.params;
    const result = await permission_service_1.PermissionServices.getStaffPermissionsFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Staff permissions retrieved successfully!",
        data: result,
    });
});
const assignPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userUuid } = req.params;
    const adminUuid = req.user?.uuid;
    if (!adminUuid) {
        throw new Error("Admin UUID not found");
    }
    const result = await permission_service_1.PermissionServices.assignPermissionsToStaff(userUuid, {
        permissions: req.body.permissions,
        grantedBy: adminUuid,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permissions assigned successfully!",
        data: result,
    });
});
const getMyPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await permission_service_1.PermissionServices.getStaffPermissionsFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your permissions retrieved successfully!",
        data: result,
    });
});
const getPermittedRoutes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await permission_service_1.PermissionServices.getPermittedRoutesForUser(userUuid);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Permitted routes retrieved successfully!",
        data: { routes: result },
    });
});
exports.PermissionControllers = {
    getAllPermissions,
    getStaffPermissions,
    assignPermissions,
    getMyPermissions,
    getPermittedRoutes,
};
//# sourceMappingURL=permission.controller.js.map