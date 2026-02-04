import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidation),
  AuthControllers.registerUser
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidation),
  AuthControllers.loginUser
);
router.post("/oauth", AuthControllers.handleOAuthLogin);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidation),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidation),
  AuthControllers.resetPassword
);
router.get("/me", auth(), AuthControllers.getCurrentUser);

export const AuthRoutes = router;
