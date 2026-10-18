import { Document } from "mongoose";
export interface IPrintMaterial {
    name: string;
    fullName?: string;
    description?: string;
    density: number;
    pricePerGram: number;
    colors: string[];
    isActive: boolean;
}
export interface IPrintPricingSettings extends Document {
    materials: IPrintMaterial[];
    machineRatePerHour: number;
    setupFee: number;
    minimumCharge: number;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=print-pricing.interface.d.ts.map