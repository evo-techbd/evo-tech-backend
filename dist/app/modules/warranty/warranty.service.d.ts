import { IWarranty } from "./warranty.interface";
export declare const WarrantyService: {
    createOrUpdateWarrantyIntoDB: (payload: Partial<IWarranty>) => Promise<import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveWarrantyFromDB: () => Promise<import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllWarrantyFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleWarrantyFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateWarrantyIntoDB: (id: string, payload: Partial<IWarranty>) => Promise<(import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteWarrantyFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IWarranty, {}, {}> & IWarranty & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=warranty.service.d.ts.map