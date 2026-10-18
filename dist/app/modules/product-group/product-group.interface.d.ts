import { Types } from "mongoose";
export interface TProductGroupMember {
    product: Types.ObjectId;
    label?: string;
}
export interface TProductGroup {
    _id?: string;
    name: string;
    title?: string;
    members: TProductGroupMember[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=product-group.interface.d.ts.map