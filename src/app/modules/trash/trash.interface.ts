import { Types } from "mongoose";

export type TTrashEntityType =
  | "product"
  | "brand"
  | "category"
  | "subcategory"
  | "coupon"
  | "review"
  | "user";

export interface TTrashItem {
  _id?: Types.ObjectId;
  entityType: TTrashEntityType;
  originalId: string;
  entityLabel: string;
  data: Record<string, any>;
  relatedData?: Record<string, any>; // for products: images, specs, etc.
  deletedAt: Date;
  deletedBy?: Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
