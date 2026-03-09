import mongoose, { Types } from "mongoose";
import { TTrashEntityType } from "./trash.interface";
export declare const TrashServices: {
    getTrashItemsFromDB: (query: Record<string, unknown>) => Promise<{
        result: (mongoose.Document<unknown, {}, import("./trash.interface").TTrashItem, {}, {}> & import("./trash.interface").TTrashItem & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    restoreTrashItemFromDB: (trashId: string) => Promise<any>;
    permanentlyDeleteTrashItemFromDB: (trashId: string) => Promise<mongoose.Document<unknown, {}, import("./trash.interface").TTrashItem, {}, {}> & import("./trash.interface").TTrashItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    clearTrashFromDB: (entityType?: TTrashEntityType) => Promise<mongoose.mongo.DeleteResult>;
    getTrashStatisticsFromDB: () => Promise<{
        total: number;
        byType: Record<string, number>;
    }>;
};
//# sourceMappingURL=trash.service.d.ts.map