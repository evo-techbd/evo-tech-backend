"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsValidation = void 0;
const zod_1 = require("zod");
const updateDeliveryChargeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        insideDhakaCharge: zod_1.z
            .number({ invalid_type_error: "Inside Dhaka charge must be a number" })
            .min(0, "Inside Dhaka charge cannot be negative")
            .optional(),
        outsideDhakaCharge: zod_1.z
            .number({ invalid_type_error: "Outside Dhaka charge must be a number" })
            .min(0, "Outside Dhaka charge cannot be negative")
            .optional(),
        additionalChargePerKg: zod_1.z
            .number({
            invalid_type_error: "Additional charge per kg must be a number",
        })
            .min(0, "Additional charge per kg cannot be negative")
            .optional(),
        expressInsideDhakaCharge: zod_1.z
            .number({
            invalid_type_error: "Express delivery charge must be a number",
        })
            .min(0, "Express delivery charge cannot be negative")
            .optional(),
        expressOutsideDhakaCharge: zod_1.z
            .number({
            invalid_type_error: "Express delivery charge must be a number",
        })
            .min(0, "Express delivery charge cannot be negative")
            .optional(),
    }),
});
exports.SettingsValidation = {
    updateDeliveryChargeValidationSchema,
};
//# sourceMappingURL=settings.validation.js.map