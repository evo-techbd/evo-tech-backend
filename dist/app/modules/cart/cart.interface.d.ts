import { Types } from "mongoose";
export interface TCart {
    _id?: string;
    user: string;
    product: Types.ObjectId;
    quantity: number;
    selectedColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TWishlist {
    _id?: string;
    user: string;
    product: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=cart.interface.d.ts.map