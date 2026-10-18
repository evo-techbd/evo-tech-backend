import { IPrintPricingSettings } from "./print-pricing.interface";
export declare const PrintPricingService: {
    getPublicPricingFromDB: () => Promise<{
        materials: import("./print-pricing.interface").IPrintMaterial[];
        machineRatePerHour: number;
        setupFee: number;
        minimumCharge: number;
        infillOptions: number[];
        layerHeightOptions: number[];
        wallOptions: number[];
    }>;
    getPricingSettingsFromDB: () => Promise<import("mongoose").Document<unknown, {}, IPrintPricingSettings, {}, {}> & IPrintPricingSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updatePricingSettingsIntoDB: (payload: Partial<IPrintPricingSettings>) => Promise<import("mongoose").Document<unknown, {}, IPrintPricingSettings, {}, {}> & IPrintPricingSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=print-pricing.service.d.ts.map