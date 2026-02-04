"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const passwordResetToken_model_1 = require("./passwordResetToken.model");
const crypto_1 = __importDefault(require("crypto"));
const registerUser = async (payload) => {
    // Check if user already exists
    const existingUser = await user_model_1.User.isUserExistsByEmail(payload.email);
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists!");
    }
    // Set role (use provided role or default to USER)
    const userData = {
        ...payload,
        userType: payload.userType || user_constant_1.USER_ROLE.USER,
    };
    // Create new user with hashed password
    const newUser = await user_model_1.User.create(userData);
    // Create access token
    const jwtPayload = {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.userType,
        uuid: newUser.uuid,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // Remove password from response
    const userObject = newUser.toObject();
    delete userObject.password;
    return {
        user: userObject,
        accessToken,
    };
};
const loginUser = async (payload) => {
    // Check if user exists
    const user = await user_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if user is active
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // Check if password matches
    const isPasswordMatched = await user_model_1.User.isPasswordMatched(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    // Update last active time
    user.lastActiveAt = new Date();
    await user.save();
    // Create JWT payload
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.userType,
        uuid: user.uuid,
    };
    // Create access token
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // Create refresh token
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    return {
        user: userObject,
        accessToken,
        refreshToken,
    };
};
const handleOAuthUser = async (payload) => {
    // Check if user exists
    let user = await user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        // Create new user for OAuth
        user = await user_model_1.User.create({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            userType: user_constant_1.USER_ROLE.USER,
            password: Math.random().toString(36).slice(-10), // Random password for OAuth users
            emailVerifiedAt: new Date(), // OAuth users are pre-verified
        });
    }
    // Check if user is active
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // Update last active time
    user.lastActiveAt = new Date();
    await user.save();
    // Create JWT payload
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.userType,
        uuid: user.uuid,
    };
    // Create access token
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // Create refresh token
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    return {
        user: userObject,
        accessToken,
        refreshToken,
    };
};
const forgotPassword = async (payload) => {
    // Check if user exists
    const user = await user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if user is active
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    // Delete any existing reset tokens for this email
    await passwordResetToken_model_1.PasswordResetToken.deleteMany({ email: payload.email });
    // Create new reset token (expires in 1 hour)
    await passwordResetToken_model_1.PasswordResetToken.create({
        email: payload.email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    // TODO: Send email with reset link
    // For now, just return the token (in production, this should be sent via email)
    const resetLink = `${config_1.default.cors_origin}/reset-password?token=${resetToken}`;
    return {
        resetToken, // Remove this in production
        resetLink, // Remove this in production
        message: "Password reset link has been sent to your email",
    };
};
const resetPassword = async (payload) => {
    // Find the reset token
    const resetTokenDoc = await passwordResetToken_model_1.PasswordResetToken.findOne({
        token: payload.token,
        expiresAt: { $gt: new Date() }, // Token not expired
    });
    if (!resetTokenDoc) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired reset token!");
    }
    // Find the user
    const user = await user_model_1.User.findOne({ email: resetTokenDoc.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Update user password
    user.password = payload.password;
    await user.save();
    // Delete the used reset token
    await passwordResetToken_model_1.PasswordResetToken.deleteOne({ token: payload.token });
    return {
        message: "Password reset successfully",
    };
};
const refreshToken = async (token) => {
    // Verify refresh token
    const { verifyToken } = await Promise.resolve().then(() => __importStar(require("../../utils/verifyJWT")));
    let decoded;
    try {
        decoded = verifyToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired refresh token!");
    }
    const { email, role } = decoded;
    // Check if user still exists
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if user is active
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is not active!");
    }
    // Create new access token
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.userType,
        uuid: user.uuid,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
};
const getCurrentUser = async (userPayload) => {
    const user = await user_model_1.User.findById(userPayload._id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    return { user };
};
exports.AuthServices = {
    registerUser,
    loginUser,
    handleOAuthUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    getCurrentUser,
};
//# sourceMappingURL=auth.service.js.map