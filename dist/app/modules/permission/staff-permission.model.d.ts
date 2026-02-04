import mongoose, { Types } from "mongoose";
export interface IStaffPermission {
    user: Types.ObjectId;
    permissions: string[];
    grantedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StaffPermission: mongoose.Model<IStaffPermission, {}, {}, {}, mongoose.Document<unknown, {}, IStaffPermission, {}, {}> & IStaffPermission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=staff-permission.model.d.ts.map