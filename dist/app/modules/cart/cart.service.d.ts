import { TCart, TWishlist } from "./cart.interface";
export declare const CartServices: {
    getCartFromDB: (userUuid: string) => Promise<(import("mongoose").Document<unknown, {}, TCart, {}, {}> & TCart & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addToCartIntoDB: (payload: TCart) => Promise<import("mongoose").Document<unknown, {}, TCart, {}, {}> & TCart & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateCartItemIntoDB: (cartItemId: string, userUuid: string, payload: Partial<TCart>) => Promise<(import("mongoose").Document<unknown, {}, TCart, {}, {}> & TCart & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    removeCartItemFromDB: (cartItemId: string, userUuid: string) => Promise<(import("mongoose").Document<unknown, {}, TCart, {}, {}> & TCart & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    clearCartFromDB: (userUuid: string) => Promise<import("mongodb").DeleteResult>;
};
export declare const WishlistServices: {
    getWishlistFromDB: (userUuid: string) => Promise<(import("mongoose").Document<unknown, {}, TWishlist, {}, {}> & TWishlist & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    addToWishlistIntoDB: (payload: TWishlist) => Promise<import("mongoose").Document<unknown, {}, TWishlist, {}, {}> & TWishlist & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    removeFromWishlistIntoDB: (wishlistItemId: string, userUuid: string) => Promise<(import("mongoose").Document<unknown, {}, TWishlist, {}, {}> & TWishlist & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    clearWishlistFromDB: (userUuid: string) => Promise<import("mongodb").DeleteResult>;
};
//# sourceMappingURL=cart.service.d.ts.map