import { TSubcategory } from "./subcategory.interface";
export declare const SubcategoryServices: {
    getAllSubcategoriesFromDB: (query: Record<string, unknown>) => Promise<{
        result: (import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
            _id: string;
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
    getSingleSubcategoryFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getSubcategoryBySlugFromDB: (slug: string) => Promise<import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    createSubcategoryIntoDB: (payload: TSubcategory, imageBuffer?: Buffer) => Promise<import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateSubcategoryIntoDB: (id: string, payload: Partial<TSubcategory>, imageBuffer?: Buffer) => Promise<(import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteSubcategoryFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TSubcategory, {}, {}> & TSubcategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=subcategory.service.d.ts.map