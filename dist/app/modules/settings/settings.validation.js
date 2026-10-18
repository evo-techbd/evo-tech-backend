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
// Empty string clears an optional link
const optionalUrl = zod_1.z
    .string()
    .trim()
    .url("Enter a full URL starting with https://")
    .or(zod_1.z.literal(""))
    .optional();
const phoneNumber = zod_1.z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{6,20}$/, "Enter a valid phone number");
const updateContactSettingsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().trim().email("Enter a valid email").optional(),
        phones: zod_1.z
            .array(phoneNumber)
            .min(1, "Add at least one phone number")
            .max(5)
            .optional(),
        whatsapp: phoneNumber.or(zod_1.z.literal("")).optional(),
        address: zod_1.z.string().trim().max(300).optional(),
        businessHours: zod_1.z.string().trim().max(500).optional(),
        mapUrl: optionalUrl,
        facebook: optionalUrl,
        instagram: optionalUrl,
        linkedin: optionalUrl,
        youtube: optionalUrl,
    }),
});
exports.SettingsValidation = {
    updateDeliveryChargeValidationSchema,
    updateContactSettingsValidationSchema,
};
//# sourceMappingURL=settings.validation.js.map