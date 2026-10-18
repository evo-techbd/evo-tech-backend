import { z } from "zod";
export declare const PrintPricingValidation: {
    updatePricingValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            materials: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                fullName: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                density: z.ZodNumber;
                pricePerGram: z.ZodNumber;
                colors: z.ZodArray<z.ZodString, "many">;
                isActive: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                isActive: boolean;
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                description?: string | undefined;
                fullName?: string | undefined;
            }, {
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                isActive?: boolean | undefined;
                description?: string | undefined;
                fullName?: string | undefined;
            }>, "many">, {
                isActive: boolean;
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                description?: string | undefined;
                fullName?: string | undefined;
            }[], {
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                isActive?: boolean | undefined;
                description?: string | undefined;
                fullName?: string | undefined;
            }[]>>;
            machineRatePerHour: z.ZodOptional<z.ZodNumber>;
            setupFee: z.ZodOptional<z.ZodNumber>;
            minimumCharge: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            materials?: {
                isActive: boolean;
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                description?: string | undefined;
                fullName?: string | undefined;
            }[] | undefined;
            machineRatePerHour?: number | undefined;
            setupFee?: number | undefined;
            minimumCharge?: number | undefined;
        }, {
            materials?: {
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                isActive?: boolean | undefined;
                description?: string | undefined;
                fullName?: string | undefined;
            }[] | undefined;
            machineRatePerHour?: number | undefined;
            setupFee?: number | undefined;
            minimumCharge?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            materials?: {
                isActive: boolean;
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                description?: string | undefined;
                fullName?: string | undefined;
            }[] | undefined;
            machineRatePerHour?: number | undefined;
            setupFee?: number | undefined;
            minimumCharge?: number | undefined;
        };
    }, {
        body: {
            materials?: {
                name: string;
                colors: string[];
                density: number;
                pricePerGram: number;
                isActive?: boolean | undefined;
                description?: string | undefined;
                fullName?: string | undefined;
            }[] | undefined;
            machineRatePerHour?: number | undefined;
            setupFee?: number | undefined;
            minimumCharge?: number | undefined;
        };
    }>;
};
//# sourceMappingURL=print-pricing.validation.d.ts.map