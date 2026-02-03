import mongoose, { Schema } from "mongoose";

export interface IPermission {
  name: string;
  code: string;
  route: string; // Route path like "/control/products"
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Dashboard',
        'Products', 
        'Sales',
        'Customers',
        'Reports',
        'Staff Management',
        'Settings',
        'Reviews',
        'Inventory'
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Permission = mongoose.model<IPermission>("Permission", permissionSchema);
