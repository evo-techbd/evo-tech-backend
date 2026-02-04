import { z } from "zod";
export declare const LandingSectionValidation: {
    createLandingSectionValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            subtitle: z.ZodOptional<z.ZodString>;
            sectionType: z.ZodOptional<z.ZodEnum<["featured", "new_arrival", "best_seller", "trending", "custom"]>>;
            category: z.ZodOptional<z.ZodString>;
            subcategory: z.ZodOptional<z.ZodString>;
            products: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        }, {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        };
    }, {
        body: {
            title: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        };
    }>;
    updateLandingSectionValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            subtitle: z.ZodOptional<z.ZodString>;
            sectionType: z.ZodOptional<z.ZodEnum<["featured", "new_arrival", "best_seller", "trending", "custom"]>>;
            category: z.ZodOptional<z.ZodString>;
            subcategory: z.ZodOptional<z.ZodString>;
            products: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        }, {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            category?: string | undefined;
            subcategory?: string | undefined;
            sortOrder?: number | undefined;
            title?: string | undefined;
            subtitle?: string | undefined;
            sectionType?: "custom" | "featured" | "new_arrival" | "best_seller" | "trending" | undefined;
            products?: string[] | undefined;
        };
    }>;
};
//# sourceMappingURL=landingsection.validation.d.ts.map