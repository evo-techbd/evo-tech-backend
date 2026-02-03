import { ILandingSection } from "./landingsection.interface";
export declare const LandingSectionService: {
    createLandingSectionIntoDB: (payload: Partial<ILandingSection>) => Promise<import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveLandingSectionsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllLandingSectionsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleLandingSectionFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateLandingSectionIntoDB: (id: string, payload: Partial<ILandingSection>) => Promise<(import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteLandingSectionFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    toggleLandingSectionStatus: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ILandingSection, {}, {}> & ILandingSection & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=landingsection.service.d.ts.map