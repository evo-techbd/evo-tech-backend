import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/verifyJWT";
import { USER_ROLE } from "../user/user.constant";
import { User } from "../user/user.model";
import {
  TLoginUser,
  TOAuthUser,
  TRegisterUser,
  TForgotPassword,
  TResetPassword,
} from "./auth.interface";
import { PasswordResetToken } from "./passwordResetToken.model";
import crypto from "crypto";

const registerUser = async (payload: TRegisterUser) => {
  // Check if user already exists
  const existingUser = await User.isUserExistsByEmail(payload.email);

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
  }

  // Set role (use provided role or default to USER)
  const userData = {
    ...payload,
    userType: payload.userType || USER_ROLE.USER,
  };

  // Create new user with hashed password
  const newUser = await User.create(userData);

  // Create access token
  const jwtPayload = {
    _id: newUser._id as string,
    email: newUser.email,
    role: newUser.userType,
    uuid: newUser.uuid,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Remove password from response
  const userObject = (newUser as any).toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    accessToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // Check if user exists
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // Check if password matches
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  // Update last active time
  user.lastActiveAt = new Date();
  await (user as any).save();

  // Create JWT payload
  const jwtPayload = {
    _id: user._id as string,
    email: user.email,
    role: user.userType,
    uuid: user.uuid,
  };

  // Create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Remove password from response
  const userObject = (user as any).toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const handleOAuthUser = async (payload: TOAuthUser) => {
  // Check if user exists
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    // Create new user for OAuth
    user = await User.create({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      userType: USER_ROLE.USER,
      password: Math.random().toString(36).slice(-10), // Random password for OAuth users
      emailVerifiedAt: new Date(), // OAuth users are pre-verified
    });
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // Update last active time
  user.lastActiveAt = new Date();
  await user.save();

  // Create JWT payload
  const jwtPayload = {
    _id: user._id as string,
    email: user.email,
    role: user.userType,
    uuid: user.uuid,
  };

  // Create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Remove password from response
  const userObject = (user as any).toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (payload: TForgotPassword) => {
  // Check if user exists
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Delete any existing reset tokens for this email
  await PasswordResetToken.deleteMany({ email: payload.email });

  // Create new reset token (expires in 1 hour)
  await PasswordResetToken.create({
    email: payload.email,
    token: resetToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  // TODO: Send email with reset link
  // For now, just return the token (in production, this should be sent via email)
  const resetLink = `${config.cors_origin}/reset-password?token=${resetToken}`;

  return {
    resetToken, // Remove this in production
    resetLink, // Remove this in production
    message: "Password reset link has been sent to your email",
  };
};

const resetPassword = async (payload: TResetPassword) => {
  // Find the reset token
  const resetTokenDoc = await PasswordResetToken.findOne({
    token: payload.token,
    expiresAt: { $gt: new Date() }, // Token not expired
  });

  if (!resetTokenDoc) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid or expired reset token!"
    );
  }

  // Find the user
  const user = await User.findOne({ email: resetTokenDoc.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Update user password
  user.password = payload.password;
  await user.save();

  // Delete the used reset token
  await PasswordResetToken.deleteOne({ token: payload.token });

  return {
    message: "Password reset successfully",
  };
};

const refreshToken = async (token: string) => {
  // Verify refresh token
  const { verifyToken } = await import("../../utils/verifyJWT");

  let decoded;
  try {
    decoded = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token!"
    );
  }

  const { email, role } = decoded;

  // Check if user still exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is not active!");
  }

  // Create new access token
  const jwtPayload = {
    _id: user._id as string,
    email: user.email,
    role: user.userType,
    uuid: user.uuid,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const getCurrentUser = async (userPayload: {
  _id: string;
  email: string;
  role: string;
}) => {
  const user = await User.findById(userPayload._id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  return { user };
};

export const AuthServices = {
  registerUser,
  loginUser,
  handleOAuthUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
