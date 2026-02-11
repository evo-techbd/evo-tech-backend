"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqValidation = void 0;
const zod_1 = require("zod");
const createFaqValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string({
            required_error: "Question is required",
        })
            .min(5, "Question must be at least 5 characters long"),
        answer: zod_1.z
            .string({
            required_error: "Answer is required",
        })
            .min(5, "Answer must be at least 5 characters long"),
        order: zod_1.z.number().int().min(0).optional(),
    }),
});
const updateFaqValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string()
            .min(5, "Question must be at least 5 characters long")
            .optional(),
        answer: zod_1.z
            .string()
            .min(5, "Answer must be at least 5 characters long")
            .optional(),
        order: zod_1.z.number().int().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.FaqValidation = {
    createFaqValidationSchema,
    updateFaqValidationSchema,
};
//# sourceMappingURL=faq.validation.js.map