import { z } from "zod";
export declare const ClientValidation: {
    createClientValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            website: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodEffects<z.ZodOptional<z.ZodBoolean>, boolean | undefined, unknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            website?: string | undefined;
        }, {
            name: string;
            isActive?: unknown;
            description?: unknown;
            sortOrder?: unknown;
            website?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            website?: string | undefined;
        };
    }, {
        body: {
            name: string;
            isActive?: unknown;
            description?: unknown;
            sortOrder?: unknown;
            website?: unknown;
        };
    }>;
    updateClientValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            website: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            description: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodEffects<z.ZodOptional<z.ZodBoolean>, boolean | undefined, unknown>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            name?: string | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            website?: string | undefined;
        }, {
            isActive?: unknown;
            name?: string | undefined;
            description?: unknown;
            sortOrder?: unknown;
            website?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            name?: string | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            website?: string | undefined;
        };
    }, {
        body: {
            isActive?: unknown;
            name?: string | undefined;
            description?: unknown;
            sortOrder?: unknown;
            website?: unknown;
        };
    }>;
};
//# sourceMappingURL=client.validation.d.ts.map