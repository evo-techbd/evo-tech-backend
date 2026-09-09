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
  }),
});

export const SettingsValidation = {
  updateDeliveryChargeValidationSchema,
};
