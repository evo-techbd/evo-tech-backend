import { z } from "zod";

export const registerValidation = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "First name is required",
    }).min(1, "First name cannot be empty"),
    lastName: z.string({
      required_error: "Last name is required", 
    }).min(1, "Last name cannot be empty"),
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }).min(1, "Password cannot be empty"),
    phone: z.string().optional(),
    newsletterOptIn: z.boolean().optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }).min(1, "Password cannot be empty"),
  }),
});

export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }).email("Invalid email format"),
  }),
});

export const resetPasswordValidation = z.object({
  body: z.object({
    token: z.string({
      required_error: "Reset token is required",
    }).min(1, "Reset token cannot be empty"),
    password: z.string({
      required_error: "Password is required",
    }).min(1, "Password cannot be empty"),
  }),
});

export const AuthValidation = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};