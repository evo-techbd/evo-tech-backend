"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintPricingValidation = void 0;
const zod_1 = require("zod");
const materialSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Material name is required"),
    fullName: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
    density: zod_1.z
        .number({ invalid_type_error: "Density must be a number" })
        .min(0.1, "Density must be at least 0.1 g/cm³"),
    pricePerGram: zod_1.z
        .number({ invalid_type_error: "Price per gram must be a number" })
        .min(0, "Price per gram cannot be negative"),
    colors: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1, "Add at least one color"),
    isActive: zod_1.z.boolean().default(true),
});
const updatePricingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        materials: zod_1.z
            .array(materialSchema)
            .min(1, "At least one material is required")
            .refine((materials) => new Set(materials.map((m) => m.name.toLowerCase())).size ===
            materials.length, "Material names must be unique")
            .optional(),
        machineRatePerHour: zod_1.z.number().min(0).optional(),
        setupFee: zod_1.z.number().min(0).optional(),
        minimumCharge: zod_1.z.number().min(0).optional(),
    }),
});
exports.PrintPricingValidation = {
    updatePricingValidationSchema,
};
//# sourceMappingURL=print-pricing.validation.js.map