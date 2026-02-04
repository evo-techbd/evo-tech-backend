import mongoose, { Schema, Types } from "mongoose";

export interface IStaffPermission {
  user: Types.ObjectId; // user MongoDB _id
  permissions: string[]; // array of permission codes
  grantedBy: Types.ObjectId; // admin who granted permissions
  createdAt: Date;
  updatedAt: Date;
}

const staffPermissionSchema = new Schema<IStaffPermission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    permissions: [{
      type: String,
      required: true,
    }],
    grantedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const StaffPermission = mongoose.model<IStaffPermission>("StaffPermission", staffPermissionSchema);
