import { IPickupPoint } from "./pickuppoint.interface";
export declare const PickupPointService: {
    createPickupPointIntoDB: (payload: Partial<IPickupPoint>) => Promise<import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActivePickupPointsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllPickupPointsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSinglePickupPointFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePickupPointIntoDB: (id: string, payload: Partial<IPickupPoint>) => Promise<(import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deletePickupPointFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    togglePickupPointStatus: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IPickupPoint, {}, {}> & IPickupPoint & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=pickuppoint.service.d.ts.map