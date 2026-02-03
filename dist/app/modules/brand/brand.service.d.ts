import { TBrand } from "./brand.interface";
export declare const BrandServices: {
    getAllBrandsFromDB: (query: Record<string, unknown>) => Promise<{
        result: {
            categories_count: number;
            subcategories_count: number;
            _id: string;
            name: string;
            slug: string;
            description?: string;
            logo?: string;
            categories?: import("mongoose").Types.ObjectId[];
            subcategories?: import("mongoose").Types.ObjectId[];
            isActive: boolean;
            sortOrder?: number;
            createdAt?: Date;
            updatedAt?: Date;
            __v: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSingleBrandFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TBrand, {}, {}> & TBrand & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getBrandBySlugFromDB: (slug: string) => Promise<import("mongoose").Document<unknown, {}, TBrand, {}, {}> & TBrand & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    createBrandIntoDB: (payload: TBrand, logoBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, TBrand, {}, {}> & TBrand & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateBrandIntoDB: (id: string, payload: Partial<TBrand>, logoBuffer?: Buffer) => Promise<(import("mongoose").Document<unknown, {}, TBrand, {}, {}> & TBrand & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteBrandFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TBrand, {}, {}> & TBrand & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=brand.service.d.ts.map