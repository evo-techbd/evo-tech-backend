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
};
//# sourceMappingURL=settings.validation.d.ts.map