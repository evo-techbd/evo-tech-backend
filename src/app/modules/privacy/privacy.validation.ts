import { z } from "zod";

const createPrivacyValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(10, "Content must be at least 10 characters long"),
    version: z.string().optional(),
  }),
});

const updatePrivacyValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(10, "Content must be at least 10 characters long")
      .optional(),
    version: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const PrivacyValidation = {
  createPrivacyValidationSchema,
  updatePrivacyValidationSchema,
};
