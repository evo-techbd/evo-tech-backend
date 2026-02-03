"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientValidation = void 0;
const zod_1 = require("zod");
const optionalUrlSchema = zod_1.z.preprocess((val) => {
    if (val === null || val === undefined) {
        return undefined;
    }
    if (typeof val === "string" && val.trim() === "") {
        return undefined;
    }
    return val;
}, zod_1.z.string().url("Invalid website URL").optional());
const optionalDescriptionSchema = zod_1.z.preprocess((val) => {
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
}, zod_1.z.string().max(300, "Description must be 300 characters or fewer").optional());
const optionalSortOrderSchema = zod_1.z.preprocess((val) => {
    if (val === null || val === undefined || val === "") {
        return undefined;
    }
    if (typeof val === "string") {
        return Number(val);
    }
    return val;
}, zod_1.z.number({ invalid_type_error: "Sort order must be a number" }).min(0, "Sort order cannot be negative").optional());
const optionalBooleanSchema = zod_1.z.preprocess((val) => {
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
}, zod_1.z.boolean().optional());
const createClientValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
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
const updateClientValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Client name cannot be empty").optional(),
        website: optionalUrlSchema,
        description: optionalDescriptionSchema,
        sortOrder: optionalSortOrderSchema,
        isActive: optionalBooleanSchema,
    }),
});
exports.ClientValidation = {
    createClientValidationSchema,
    updateClientValidationSchema,
};
//# sourceMappingURL=client.validation.js.map