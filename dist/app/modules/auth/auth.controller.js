"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const registerUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully!",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        path: "/",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User successfully logged in!",
        data: {
            user,
            accessToken,
        },
    });
});
const handleOAuthLogin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.handleOAuthUser(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        path: "/",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User successfully authenticated!",
        data: {
            user,
            accessToken,
        },
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Clear refresh token cookie with matching options
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged out successfully!",
        data: null,
    });
});
const refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { refreshToken: token } = req.cookies;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token not found!");
    }
    const result = await auth_service_1.AuthServices.refreshToken(token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token refreshed successfully!",
        data: result,
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset link sent to your email!",
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.resetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully!",
        data: result,
    });
});
const getCurrentUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userPayload = req.user;
    const result = await auth_service_1.AuthServices.getCurrentUser(userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully!",
        data: result,
    });
});
exports.AuthControllers = {
    registerUser,
    loginUser,
    handleOAuthLogin,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    getCurrentUser,
};
//# sourceMappingURL=auth.controller.js.map