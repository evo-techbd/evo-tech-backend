import { z } from "zod";

const materialSchema = z.object({
  name: z.string().trim().min(1, "Material name is required"),
  fullName: z.string().trim().optional(),
  description: z.string().trim().optional(),
  density: z
    .number({ invalid_type_error: "Density must be a number" })
    .min(0.1, "Density must be at least 0.1 g/cm³"),
  pricePerGram: z
    .number({ invalid_type_error: "Price per gram must be a number" })
    .min(0, "Price per gram cannot be negative"),
  colors: z.array(z.string().trim().min(1)).min(1, "Add at least one color"),
  isActive: z.boolean().default(true),
});

const updatePricingValidationSchema = z.object({
  body: z.object({
    materials: z
      .array(materialSchema)
      .min(1, "At least one material is required")
      .refine(
        (materials) =>
          new Set(materials.map((m) => m.name.toLowerCase())).size ===
          materials.length,
        "Material names must be unique",
      )
      .optional(),
    machineRatePerHour: z.number().min(0).optional(),
    setupFee: z.number().min(0).optional(),
    minimumCharge: z.number().min(0).optional(),
  }),
});

export const PrintPricingValidation = {
  updatePricingValidationSchema,
};
