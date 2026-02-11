import { z } from "zod";
export declare const PageContentValidation: {
    createPageContentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            content: z.ZodString;
            version: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            content: string;
            version?: string | undefined;
        }, {
            content: string;
            version?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            content: string;
            version?: string | undefined;
        };
    }, {
        body: {
            content: string;
            version?: string | undefined;
        };
    }>;
    updatePageContentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            content: z.ZodOptional<z.ZodString>;
            version: z.ZodOptional<z.ZodString>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            version?: string | undefined;
            content?: string | undefined;
        }, {
            isActive?: boolean | undefined;
            version?: string | undefined;
            content?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            version?: string | undefined;
            content?: string | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            version?: string | undefined;
            content?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=page-content.validation.d.ts.map