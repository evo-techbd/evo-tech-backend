import { z } from "zod";
export declare const ProductGroupValidation: {
    createProductGroupValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            members: z.ZodArray<z.ZodObject<{
                product: z.ZodString;
                label: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                product: string;
                label?: string | undefined;
            }, {
                product: string;
                label?: string | undefined;
            }>, "many">;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            members: {
                product: string;
                label?: string | undefined;
            }[];
            isActive?: boolean | undefined;
            title?: string | undefined;
        }, {
            name: string;
            members: {
                product: string;
                label?: string | undefined;
            }[];
            isActive?: boolean | undefined;
            title?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name: string;
            members: {
                product: string;
                label?: string | undefined;
            }[];
            isActive?: boolean | undefined;
            title?: string | undefined;
        };
    }, {
        body: {
            name: string;
            members: {
                product: string;
                label?: string | undefined;
            }[];
            isActive?: boolean | undefined;
            title?: string | undefined;
        };
    }>;
    updateProductGroupValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            members: z.ZodOptional<z.ZodArray<z.ZodObject<{
                product: z.ZodString;
                label: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                product: string;
                label?: string | undefined;
            }, {
                product: string;
                label?: string | undefined;
            }>, "many">>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            name?: string | undefined;
            title?: string | undefined;
            members?: {
                product: string;
                label?: string | undefined;
            }[] | undefined;
        }, {
            isActive?: boolean | undefined;
            name?: string | undefined;
            title?: string | undefined;
            members?: {
                product: string;
                label?: string | undefined;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            name?: string | undefined;
            title?: string | undefined;
            members?: {
                product: string;
                label?: string | undefined;
            }[] | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            name?: string | undefined;
            title?: string | undefined;
            members?: {
                product: string;
                label?: string | undefined;
            }[] | undefined;
        };
    }>;
};
//# sourceMappingURL=product-group.validation.d.ts.map