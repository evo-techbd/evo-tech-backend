import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id");

const memberSchema = z.object({
  product: objectId,
  label: z.string().trim().max(40, "Label must be 40 characters or less").optional(),
});

const membersSchema = z
  .array(memberSchema)
  .min(2, "A group needs at least 2 products")
  .max(12, "A group can have at most 12 products");

const createProductGroupValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Group name is required" }).trim().min(1),
    title: z.string().trim().max(60).optional(),
    members: membersSchema,
    isActive: z.boolean().optional(),
  }),
});

const updateProductGroupValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    title: z.string().trim().max(60).optional(),
    members: membersSchema.optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ProductGroupValidation = {
  createProductGroupValidationSchema,
  updateProductGroupValidationSchema,
};
