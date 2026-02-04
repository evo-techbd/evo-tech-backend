"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerValidation = void 0;
const zod_1 = require("zod");
const sortOrderSchema = zod_1.z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
}, zod_1.z.number().int().min(0, "Sort order cannot be negative").optional());
const createBannerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .min(1, "Title cannot be empty"),
        subtitle: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        button_text: zod_1.z.string().optional(),
        button_url: zod_1.z.string().optional(),
        more_text: zod_1.z.string().optional(),
        sortOrder: sortOrderSchema,
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateBannerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title cannot be empty").optional(),
        subtitle: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        button_text: zod_1.z.string().optional(),
        button_url: zod_1.z.string().optional(),
        more_text: zod_1.z.string().optional(),
        sortOrder: sortOrderSchema,
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.BannerValidation = {
    createBannerValidationSchema,
    updateBannerValidationSchema,
};
//# sourceMappingURL=banner.validation.js.map