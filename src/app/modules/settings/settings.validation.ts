import { z } from "zod";

const updateDeliveryChargeValidationSchema = z.object({
  body: z.object({
    insideDhakaCharge: z
      .number({ invalid_type_error: "Inside Dhaka charge must be a number" })
      .min(0, "Inside Dhaka charge cannot be negative")
      .optional(),
    outsideDhakaCharge: z
      .number({ invalid_type_error: "Outside Dhaka charge must be a number" })
      .min(0, "Outside Dhaka charge cannot be negative")
      .optional(),
    additionalChargePerKg: z
      .number({
        invalid_type_error: "Additional charge per kg must be a number",
      })
      .min(0, "Additional charge per kg cannot be negative")
      .optional(),
    expressInsideDhakaCharge: z
      .number({
        invalid_type_error: "Express delivery charge must be a number",
      })
      .min(0, "Express delivery charge cannot be negative")
      .optional(),
    expressOutsideDhakaCharge: z
      .number({
        invalid_type_error: "Express delivery charge must be a number",
      })
      .min(0, "Express delivery charge cannot be negative")
      .optional(),
  }),
});

// Empty string clears an optional link
const optionalUrl = z
  .string()
  .trim()
  .url("Enter a full URL starting with https://")
  .or(z.literal(""))
  .optional();

const phoneNumber = z
  .string()
  .trim()
  .regex(/^\+?[\d\s-]{6,20}$/, "Enter a valid phone number");

const updateContactSettingsValidationSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Enter a valid email").optional(),
    phones: z
      .array(phoneNumber)
      .min(1, "Add at least one phone number")
      .max(5)
      .optional(),
    whatsapp: phoneNumber.or(z.literal("")).optional(),
    address: z.string().trim().max(300).optional(),
    businessHours: z.string().trim().max(500).optional(),
    mapUrl: optionalUrl,
    facebook: optionalUrl,
    instagram: optionalUrl,
    linkedin: optionalUrl,
    youtube: optionalUrl,
  }),
});

export const SettingsValidation = {
  updateDeliveryChargeValidationSchema,
  updateContactSettingsValidationSchema,
};
