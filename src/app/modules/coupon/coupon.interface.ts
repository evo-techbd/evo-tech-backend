import { Document, Types } from "mongoose";

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  maxUsageCount: number;
  currentUsageCount: number;
  isReusable: boolean;
  isActive: boolean;
  description?: string;
  applicableCategories?: Types.ObjectId[];
  applicableProducts?: Types.ObjectId[];
  excludedCategories?: Types.ObjectId[];
  excludedProducts?: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICouponUsage extends Document {
  _id: Types.ObjectId;
  couponId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  discountApplied: number;
  usedAt: Date;
}
