import { z } from "zod";

const createPageContentValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(10, "Content must be at least 10 characters long"),
    version: z.string().optional(),
  }),
});

const updatePageContentValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(10, "Content must be at least 10 characters long")
      .optional(),
    version: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const PageContentValidation = {
  createPageContentValidationSchema,
  updatePageContentValidationSchema,
};
