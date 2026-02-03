import { Document, Types } from "mongoose";
export interface ILandingSection extends Document {
    title: string;
    subtitle?: string;
    sectionType: "featured" | "new_arrival" | "best_seller" | "trending" | "custom";
    category?: Types.ObjectId;
    subcategory?: Types.ObjectId;
    products?: Types.ObjectId[];
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=landingsection.interface.d.ts.map