import { Document, Types } from 'mongoose';
export interface ICoupon extends Document {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
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
    applicableCategories?: string[];
    applicableProducts?: string[];
    excludedCategories?: string[];
    excludedProducts?: string[];
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICouponUsage extends Document {
    _id: string;
    couponId: Types.ObjectId;
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    discountApplied: number;
    usedAt: Date;
}
//# sourceMappingURL=coupon.interface.d.ts.map