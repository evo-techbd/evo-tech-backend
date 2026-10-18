import { z } from "zod";
export declare const SettingsValidation: {
    updateDeliveryChargeValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            insideDhakaCharge: z.ZodOptional<z.ZodNumber>;
            outsideDhakaCharge: z.ZodOptional<z.ZodNumber>;
            additionalChargePerKg: z.ZodOptional<z.ZodNumber>;
            expressInsideDhakaCharge: z.ZodOptional<z.ZodNumber>;
            expressOutsideDhakaCharge: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            insideDhakaCharge?: number | undefined;
            outsideDhakaCharge?: number | undefined;
            additionalChargePerKg?: number | undefined;
            expressInsideDhakaCharge?: number | undefined;
            expressOutsideDhakaCharge?: number | undefined;
        }, {
            insideDhakaCharge?: number | undefined;
            outsideDhakaCharge?: number | undefined;
            additionalChargePerKg?: number | undefined;
            expressInsideDhakaCharge?: number | undefined;
            expressOutsideDhakaCharge?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            insideDhakaCharge?: number | undefined;
            outsideDhakaCharge?: number | undefined;
            additionalChargePerKg?: number | undefined;
            expressInsideDhakaCharge?: number | undefined;
            expressOutsideDhakaCharge?: number | undefined;
        };
    }, {
        body: {
            insideDhakaCharge?: number | undefined;
            outsideDhakaCharge?: number | undefined;
            additionalChargePerKg?: number | undefined;
            expressInsideDhakaCharge?: number | undefined;
            expressOutsideDhakaCharge?: number | undefined;
        };
    }>;
    updateContactSettingsValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodOptional<z.ZodString>;
            phones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            whatsapp: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
            address: z.ZodOptional<z.ZodString>;
            businessHours: z.ZodOptional<z.ZodString>;
            mapUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
            facebook: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
            instagram: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
            linkedin: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
            youtube: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
        }, "strip", z.ZodTypeAny, {
            email?: string | undefined;
            facebook?: string | undefined;
            address?: string | undefined;
            phones?: string[] | undefined;
            whatsapp?: string | undefined;
            businessHours?: string | undefined;
            mapUrl?: string | undefined;
            instagram?: string | undefined;
            linkedin?: string | undefined;
            youtube?: string | undefined;
        }, {
            email?: string | undefined;
            facebook?: string | undefined;
            address?: string | undefined;
            phones?: string[] | undefined;
            whatsapp?: string | undefined;
            businessHours?: string | undefined;
            mapUrl?: string | undefined;
            instagram?: string | undefined;
            linkedin?: string | undefined;
            youtube?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email?: string | undefined;
            facebook?: string | undefined;
            address?: string | undefined;
            phones?: string[] | undefined;
            whatsapp?: string | undefined;
            businessHours?: string | undefined;
            mapUrl?: string | undefined;
            instagram?: string | undefined;
            linkedin?: string | undefined;
            youtube?: string | undefined;
        };
    }, {
        body: {
            email?: string | undefined;
            facebook?: string | undefined;
            address?: string | undefined;
            phones?: string[] | undefined;
            whatsapp?: string | undefined;
            businessHours?: string | undefined;
            mapUrl?: string | undefined;
            instagram?: string | undefined;
            linkedin?: string | undefined;
            youtube?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=settings.validation.d.ts.map