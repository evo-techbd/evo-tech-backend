import { TOrder, TOrderItem } from "./order.interface";
export declare const Order: import("mongoose").Model<TOrder, {}, {}, {}, import("mongoose").Document<unknown, {}, TOrder, {}, {}> & TOrder & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const OrderItem: import("mongoose").Model<TOrderItem, {}, {}, {}, import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=order.model.d.ts.map