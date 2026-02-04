import { Document } from "mongoose";
export interface IBanner extends Document {
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    button_text?: string;
    button_url?: string;
    more_text?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=banner.interface.d.ts.map