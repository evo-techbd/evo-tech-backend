import { Types } from "mongoose";
export interface TBrand {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    categories?: Types.ObjectId[];
    subcategories?: Types.ObjectId[];
    isActive: boolean;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=brand.interface.d.ts.map