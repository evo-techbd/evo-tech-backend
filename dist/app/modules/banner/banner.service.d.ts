import { IBanner } from "./banner.interface";
export declare const BannerService: {
    createBannerIntoDB: (payload: Partial<IBanner>, file: Express.Multer.File) => Promise<import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getActiveBannersFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllBannersFromDB: () => Promise<(import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getSingleBannerFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateBannerIntoDB: (id: string, payload: Partial<IBanner>, file?: Express.Multer.File) => Promise<(import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteBannerFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    toggleBannerStatus: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=banner.service.d.ts.map