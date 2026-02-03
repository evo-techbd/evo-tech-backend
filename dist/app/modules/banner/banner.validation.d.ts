import { z } from "zod";
export declare const BannerValidation: {
    createBannerValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            subtitle: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            button_text: z.ZodOptional<z.ZodString>;
            button_url: z.ZodOptional<z.ZodString>;
            more_text: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        }, {
            title: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: unknown;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        };
    }, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: unknown;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        };
    }>;
    updateBannerValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            subtitle: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            button_text: z.ZodOptional<z.ZodString>;
            button_url: z.ZodOptional<z.ZodString>;
            more_text: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            image?: string | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        }, {
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: unknown;
            title?: string | undefined;
            image?: string | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            image?: string | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            description?: string | undefined;
            sortOrder?: unknown;
            title?: string | undefined;
            image?: string | undefined;
            subtitle?: string | undefined;
            button_text?: string | undefined;
            button_url?: string | undefined;
            more_text?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=banner.validation.d.ts.map