import { z } from "zod";

const sortOrderSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}, z.number().int().min(0, "Sort order cannot be negative").optional());

const createBannerValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(1, "Title cannot be empty"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    button_text: z.string().optional(),
    button_url: z.string().optional(),
    more_text: z.string().optional(),
    sortOrder: sortOrderSchema,
    isActive: z.boolean().optional(),
  }),
});

const updateBannerValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    button_text: z.string().optional(),
    button_url: z.string().optional(),
    more_text: z.string().optional(),
    sortOrder: sortOrderSchema,
    isActive: z.boolean().optional(),
  }),
});

export const BannerValidation = {
  createBannerValidationSchema,
  updateBannerValidationSchema,
};
