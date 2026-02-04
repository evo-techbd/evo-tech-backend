"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await user_service_1.UserServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users Retrieved Successfully",
        data: users.result,
        meta: users.meta,
    });
});
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.getSingleUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User Retrieved Successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const requestingUser = req.user;
    // console.log('🔄 Update user request:', {
    //   id,
    //   requestingUserId: requestingUser?._id,
    //   requestingUserRole: requestingUser?.role,
    //   body: req.body
    // });
    // Check if user is trying to update their own profile or if they're an admin
    if (requestingUser?.role !== 'admin' && requestingUser?._id !== id) {
        // console.log('❌ Forbidden: User trying to update another user profile');
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.FORBIDDEN,
            message: "You can only update your own profile",
            data: null,
        });
    }
    const result = await user_service_1.UserServices.updateUserIntoDB(req.body, id);
    // console.log('✅ User updated successfully:', result?._id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User updated successfully",
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await user_service_1.UserServices.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User deleted successfully",
        data: null,
    });
});
const getUserDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid; // From auth middleware
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await user_service_1.UserServices.getUserDashboardStatsFromDB(userUuid);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User dashboard stats retrieved successfully",
        data: result,
    });
});
const getUserOrders = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userUuid = req.user?.uuid; // From auth middleware
    if (!userUuid) {
        throw new Error("User UUID not found");
    }
    const result = await user_service_1.UserServices.getUserOrdersFromDB(userUuid, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User orders retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const createStaff = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserServices.createStaffIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Staff member created successfully",
        data: result,
    });
});
exports.UserControllers = {
    getSingleUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserDashboardStats,
    getUserOrders,
    createStaff,
};
//# sourceMappingURL=user.controller.js.map