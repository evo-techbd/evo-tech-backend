import { TCategory } from "./category.interface";
export declare const CategoryServices: {
    getAllCategoriesFromDB: (query: Record<string, unknown>) => Promise<{
        result: {
            subcategories_count: number;
            brands_count: number;
            _id: string;
            name: string;
            slug: string;
            description?: string;
            image?: string;
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
    getSingleCategoryFromDB: (id: string) => Promise<{
        subcategories_count: number;
        brands_count: number;
        _id: string;
        name: string;
        slug: string;
        description?: string;
        image?: string;
        isActive: boolean;
        sortOrder?: number;
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    getCategoryBySlugFromDB: (slug: string) => Promise<{
        subcategories_count: number;
        brands_count: number;
        _id: string;
        name: string;
        slug: string;
        description?: string;
        image?: string;
        isActive: boolean;
        sortOrder?: number;
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    createCategoryIntoDB: (payload: TCategory, imageBuffer?: Buffer) => Promise<{
        subcategories_count: number;
        brands_count: number;
        _id: string;
        name: string;
        slug: string;
        description?: string;
        image?: string;
        isActive: boolean;
        sortOrder?: number;
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    updateCategoryIntoDB: (id: string, payload: Partial<TCategory>, imageBuffer?: Buffer) => Promise<{
        subcategories_count: number;
        brands_count: number;
        _id: string;
        name: string;
        slug: string;
        description?: string;
        image?: string;
        isActive: boolean;
        sortOrder?: number;
        createdAt?: Date;
        updatedAt?: Date;
        __v: number;
    }>;
    deleteCategoryFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TCategory, {}, {}> & TCategory & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=category.service.d.ts.map