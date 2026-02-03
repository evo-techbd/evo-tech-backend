"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = require("../utils/catchAsync");
const verifyJWT_1 = require("../utils/verifyJWT");
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        // console.log("🔐 Auth middleware - Headers:", {
        //   hasAuth: !!authorizationHeader,
        //   authHeader: authorizationHeader
        //     ? authorizationHeader.substring(0, 20) + "..."
        //     : "none",
        //   requiredRoles,
        // });
        // Checking if the token is missing
        if (!authorizationHeader) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // Extract token from "Bearer <token>" format
        const token = authorizationHeader.startsWith("Bearer ")
            ? authorizationHeader.substring(7)
            : authorizationHeader;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // Verify token
        let decoded;
        try {
            decoded = (0, verifyJWT_1.verifyToken)(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token!");
        }
        const { email, role } = decoded;
        // Check if user exists
        const user = await user_model_1.User.findOne({ email }).select("+password");
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
        }
        // Check if user is active
        if (!user.isActive) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is not active!");
        }
        // Check role authorization - use userType from database
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to access this resource!");
        }
        // Attach user to request
        req.user = {
            ...decoded,
            uuid: user.uuid,
            _id: user._id.toString(),
            email: user.email,
            role: user.userType,
            userType: user.userType,
        };
        next();
    });
};
exports.default = auth;
//# sourceMappingURL=auth.js.map