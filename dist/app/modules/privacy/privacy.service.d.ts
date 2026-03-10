import { IPrivacy } from "./privacy.interface";
export declare const PrivacyService: {
    createOrUpdatePrivacyIntoDB: (payload: Partial<IPrivacy>) => Promise<import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getActivePrivacyFromDB: () => Promise<import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllPrivacyFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSinglePrivacyFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updatePrivacyIntoDB: (id: string, payload: Partial<IPrivacy>) => Promise<(import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deletePrivacyFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IPrivacy, {}, {}> & IPrivacy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=privacy.service.d.ts.map