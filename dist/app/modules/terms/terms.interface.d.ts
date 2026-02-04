import { Document } from "mongoose";
export interface ITerms extends Document {
    content: string;
    version: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=terms.interface.d.ts.map