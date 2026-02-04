import { ICoupon } from "./coupon.interface";
export declare const CouponService: {
    createCoupon: (couponData: Partial<ICoupon>) => Promise<ICoupon>;
    getAllCoupons: (query: any) => Promise<{
        coupons: (import("mongoose").FlattenMaps<ICoupon> & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCouponById: (id: string) => Promise<ICoupon | null>;
    getCouponByCode: (code: string) => Promise<ICoupon | null>;
    validateCoupon: (code: string, userId: string, orderAmount: number) => Promise<{
        coupon: ICoupon;
        discountAmount: number;
    }>;
    applyCoupon: (code: string, userId: string, orderId: string, discountApplied: number) => Promise<{
        success: boolean;
        message: string;
    }>;
    updateCoupon: (id: string, updateData: Partial<ICoupon>) => Promise<ICoupon | null>;
    deleteCoupon: (id: string) => Promise<void>;
    getCouponStats: (id: string) => Promise<{
        coupon: import("mongoose").Document<unknown, {}, ICoupon, {}, {}> & ICoupon & Required<{
            _id: string;
        }> & {
            __v: number;
        };
        usageRecords: (import("mongoose").Document<unknown, {}, import("./coupon.interface").ICouponUsage, {}, {}> & import("./coupon.interface").ICouponUsage & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        stats: {
            totalUsages: number;
            remainingUsages: number;
            totalDiscountGiven: number;
            uniqueUsers: number;
        };
    }>;
};
//# sourceMappingURL=coupon.service.d.ts.map