import { IContactSettings, IDeliveryChargeSettings } from "./settings.interface";
export declare const SettingsService: {
    getDeliveryChargeSettingsFromDB: () => Promise<import("mongoose").Document<unknown, {}, IDeliveryChargeSettings, {}, {}> & IDeliveryChargeSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateDeliveryChargeSettingsIntoDB: (payload: Partial<IDeliveryChargeSettings>) => Promise<import("mongoose").Document<unknown, {}, IDeliveryChargeSettings, {}, {}> & IDeliveryChargeSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getContactSettingsFromDB: () => Promise<import("mongoose").Document<unknown, {}, IContactSettings, {}, {}> & IContactSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateContactSettingsIntoDB: (payload: Partial<IContactSettings>) => Promise<import("mongoose").Document<unknown, {}, IContactSettings, {}, {}> & IContactSettings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=settings.service.d.ts.map