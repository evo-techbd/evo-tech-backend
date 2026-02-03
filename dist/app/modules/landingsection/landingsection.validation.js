"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingSectionValidation = void 0;
const zod_1 = require("zod");
const createLandingSectionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Section title is required",
        })
            .min(1, "Title cannot be empty"),
        subtitle: zod_1.z.string().optional(),
        sectionType: zod_1.z
            .enum(["featured", "new_arrival", "best_seller", "trending", "custom"])
            .optional(),
        category: zod_1.z.string().optional(),
        subcategory: zod_1.z.string().optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
        sortOrder: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateLandingSectionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title cannot be empty").optional(),
        subtitle: zod_1.z.string().optional(),
        sectionType: zod_1.z
            .enum(["featured", "new_arrival", "best_seller", "trending", "custom"])
            .optional(),
        category: zod_1.z.string().optional(),
        subcategory: zod_1.z.string().optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
        sortOrder: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.LandingSectionValidation = {
    createLandingSectionValidationSchema,
    updateLandingSectionValidationSchema,
};
//# sourceMappingURL=landingsection.validation.js.map