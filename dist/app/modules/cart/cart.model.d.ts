import { TCart, TWishlist } from "./cart.interface";
export declare const Cart: import("mongoose").Model<TCart, {}, {}, {}, import("mongoose").Document<unknown, {}, TCart, {}, {}> & TCart & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const Wishlist: import("mongoose").Model<TWishlist, {}, {}, {}, import("mongoose").Document<unknown, {}, TWishlist, {}, {}> & TWishlist & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=cart.model.d.ts.map