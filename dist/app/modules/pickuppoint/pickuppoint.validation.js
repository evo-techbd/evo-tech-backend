"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupPointValidation = void 0;
const zod_1 = require("zod");
const sortOrderSchema = zod_1.z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
}, zod_1.z.number().int().min(0, "Sort order cannot be negative").optional());
const createPickupPointValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Pickup point name is required",
        })
            .min(1, "Name cannot be empty"),
        address: zod_1.z
            .string({
            required_error: "Address is required",
        })
            .min(1, "Address cannot be empty"),
        city: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        hours: zod_1.z.string().optional(),
        sortOrder: sortOrderSchema,
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updatePickupPointValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        address: zod_1.z.string().min(1, "Address cannot be empty").optional(),
        city: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        hours: zod_1.z.string().optional(),
        sortOrder: sortOrderSchema,
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.PickupPointValidation = {
    createPickupPointValidationSchema,
    updatePickupPointValidationSchema,
};
//# sourceMappingURL=pickuppoint.validation.js.map