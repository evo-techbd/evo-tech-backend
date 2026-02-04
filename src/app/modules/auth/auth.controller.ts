import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const registerUser = catchAsync(async (req, res) => {

  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { user, accessToken, refreshToken } = result;

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    path: "/",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User successfully logged in!",
    data: {
      user,
      accessToken,
    },
  });
});

const handleOAuthLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.handleOAuthUser(req.body);
  const { user, accessToken, refreshToken } = result;

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    path: "/",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User successfully authenticated!",
    data: {
      user,
      accessToken,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  // Clear refresh token cookie with matching options
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully!",
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found!");
  }

  const result = await AuthServices.refreshToken(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully!",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent to your email!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const userPayload = req.user as { _id: string; email: string; role: string };
  const result = await AuthServices.getCurrentUser(userPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  handleOAuthLogin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
