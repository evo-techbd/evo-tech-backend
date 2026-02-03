import { z } from "zod";

const optionalUrlSchema = z.preprocess((val) => {
  if (val === null || val === undefined) {
    return undefined;
  }

  if (typeof val === "string" && val.trim() === "") {
    return undefined;
  }

  return val;
}, z.string().url("Invalid website URL").optional());

const optionalDescriptionSchema = z.preprocess((val) => {
  if (val === null || val === undefined) {
    return undefined;
  }

  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") {
      return undefined;
    }
    return trimmed;
  }

  return val;
}, z.string().max(300, "Description must be 300 characters or fewer").optional());

const optionalSortOrderSchema = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") {
    return undefined;
  }

  if (typeof val === "string") {
    return Number(val);
  }

  return val;
}, z.number({ invalid_type_error: "Sort order must be a number" }).min(0, "Sort order cannot be negative").optional());

const optionalBooleanSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    const normalized = val.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return val;
}, z.boolean().optional());

const createClientValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Client name is required",
      })
      .min(1, "Client name cannot be empty"),
    website: optionalUrlSchema,
    description: optionalDescriptionSchema,
    sortOrder: optionalSortOrderSchema,
    isActive: optionalBooleanSchema,
  }),
});

const updateClientValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Client name cannot be empty").optional(),
    website: optionalUrlSchema,
    description: optionalDescriptionSchema,
    sortOrder: optionalSortOrderSchema,
    isActive: optionalBooleanSchema,
  }),
});

export const ClientValidation = {
  createClientValidationSchema,
  updateClientValidationSchema,
};
