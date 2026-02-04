import { z } from "zod";

const createLandingSectionValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Section title is required",
      })
      .min(1, "Title cannot be empty"),
    subtitle: z.string().optional(),
    sectionType: z
      .enum(["featured", "new_arrival", "best_seller", "trending", "custom"])
      .optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    products: z.array(z.string()).optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateLandingSectionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    subtitle: z.string().optional(),
    sectionType: z
      .enum(["featured", "new_arrival", "best_seller", "trending", "custom"])
      .optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    products: z.array(z.string()).optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const LandingSectionValidation = {
  createLandingSectionValidationSchema,
  updateLandingSectionValidationSchema,
};
