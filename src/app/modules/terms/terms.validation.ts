import { z } from "zod";

const createTermsValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(10, "Content must be at least 10 characters long"),
    version: z.string().optional(),
  }),
});

const updateTermsValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(10, "Content must be at least 10 characters long")
      .optional(),
    version: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const TermsValidation = {
  createTermsValidationSchema,
  updateTermsValidationSchema,
};
