import { z } from "zod";
export declare const FaqValidation: {
    createFaqValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodString;
            answer: z.ZodString;
            order: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            question: string;
            answer: string;
            order?: number | undefined;
        }, {
            question: string;
            answer: string;
            order?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            question: string;
            answer: string;
            order?: number | undefined;
        };
    }, {
        body: {
            question: string;
            answer: string;
            order?: number | undefined;
        };
    }>;
    updateFaqValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodOptional<z.ZodString>;
            answer: z.ZodOptional<z.ZodString>;
            order: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            order?: number | undefined;
            question?: string | undefined;
            answer?: string | undefined;
        }, {
            isActive?: boolean | undefined;
            order?: number | undefined;
            question?: string | undefined;
            answer?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            order?: number | undefined;
            question?: string | undefined;
            answer?: string | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            order?: number | undefined;
            question?: string | undefined;
            answer?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=faq.validation.d.ts.map