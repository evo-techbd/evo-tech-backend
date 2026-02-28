import { Document } from "mongoose";
export interface IPickupPoint extends Document {
    name: string;
    address: string;
    city?: string;
    phone?: string;
    hours?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=pickuppoint.interface.d.ts.map