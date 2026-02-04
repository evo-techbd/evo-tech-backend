import { Document } from "mongoose";
export interface IClient extends Document {
    name: string;
    logo: string;
    website?: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=client.interface.d.ts.map