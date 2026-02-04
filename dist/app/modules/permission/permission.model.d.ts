import mongoose from "mongoose";
export interface IPermission {
    name: string;
    code: string;
    route: string;
    category: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Permission: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, {}> & IPermission & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=permission.model.d.ts.map