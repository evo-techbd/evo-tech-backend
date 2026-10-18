import { TProductGroup } from "./product-group.interface";
export declare const ProductGroupService: {
    createProductGroupIntoDB: (payload: TProductGroup) => Promise<import("mongoose").Document<unknown, {}, TProductGroup, {}, {}> & TProductGroup & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllProductGroupsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, TProductGroup, {}, {}> & TProductGroup & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    getSingleProductGroupFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TProductGroup, {}, {}> & TProductGroup & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateProductGroupIntoDB: (id: string, payload: Partial<TProductGroup>) => Promise<(import("mongoose").Document<unknown, {}, TProductGroup, {}, {}> & TProductGroup & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteProductGroupFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TProductGroup, {}, {}> & TProductGroup & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getGroupForProductFromDB: (productId: string) => Promise<{
        _id: string;
        title: string;
        members: {
            _id: any;
            name: any;
            label: any;
            slug: any;
            mainImage: any;
            price: any;
            previousPrice: any;
            preOrderPrice: any;
            isPreOrder: any;
            inStock: any;
        }[];
    } | null>;
};
//# sourceMappingURL=product-group.service.d.ts.map