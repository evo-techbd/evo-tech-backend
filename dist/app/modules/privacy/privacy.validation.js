"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyValidation = void 0;
const zod_1 = require("zod");
const createPrivacyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .string({
            required_error: "Content is required",
        })
            .min(10, "Content must be at least 10 characters long"),
        version: zod_1.z.string().optional(),
    }),
});
const updatePrivacyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .string()
            .min(10, "Content must be at least 10 characters long")
            .optional(),
        version: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.PrivacyValidation = {
    createPrivacyValidationSchema,
    updatePrivacyValidationSchema,
};
//# sourceMappingURL=privacy.validation.js.map