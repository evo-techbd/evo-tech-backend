import { z } from "zod";
export declare const PickupPointValidation: {
    createPickupPointValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            address: z.ZodString;
            city: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            hours: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            address: string;
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            city?: string | undefined;
            sortOrder?: number | undefined;
        }, {
            name: string;
            address: string;
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            city?: string | undefined;
            sortOrder?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name: string;
            address: string;
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            city?: string | undefined;
            sortOrder?: number | undefined;
        };
    }, {
        body: {
            name: string;
            address: string;
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            city?: string | undefined;
            sortOrder?: unknown;
        };
    }>;
    updatePickupPointValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            hours: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            city?: string | undefined;
            address?: string | undefined;
            sortOrder?: number | undefined;
        }, {
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            city?: string | undefined;
            address?: string | undefined;
            sortOrder?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            city?: string | undefined;
            address?: string | undefined;
            sortOrder?: number | undefined;
        };
    }, {
        body: {
            hours?: string | undefined;
            phone?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            city?: string | undefined;
            address?: string | undefined;
            sortOrder?: unknown;
        };
    }>;
};
//# sourceMappingURL=pickuppoint.validation.d.ts.map