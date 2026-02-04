import { Types } from "mongoose";
export interface TSubcategory {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    category: Types.ObjectId;
    image?: string;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=subcategory.interface.d.ts.map