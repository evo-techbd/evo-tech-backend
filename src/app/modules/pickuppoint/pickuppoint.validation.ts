import { z } from "zod";

const sortOrderSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}, z.number().int().min(0, "Sort order cannot be negative").optional());

const createPickupPointValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Pickup point name is required",
      })
      .min(1, "Name cannot be empty"),
    address: z
      .string({
        required_error: "Address is required",
      })
      .min(1, "Address cannot be empty"),
    city: z.string().optional(),
    phone: z.string().optional(),
    hours: z.string().optional(),
    sortOrder: sortOrderSchema,
    isActive: z.boolean().optional(),
  }),
});

const updatePickupPointValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    address: z.string().min(1, "Address cannot be empty").optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    hours: z.string().optional(),
    sortOrder: sortOrderSchema,
    isActive: z.boolean().optional(),
  }),
});

export const PickupPointValidation = {
  createPickupPointValidationSchema,
  updatePickupPointValidationSchema,
};
