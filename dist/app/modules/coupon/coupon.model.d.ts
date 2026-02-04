import { ICoupon, ICouponUsage } from './coupon.interface';
export declare const Coupon: import("mongoose").Model<ICoupon, {}, {}, {}, import("mongoose").Document<unknown, {}, ICoupon, {}, {}> & ICoupon & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare const CouponUsage: import("mongoose").Model<ICouponUsage, {}, {}, {}, import("mongoose").Document<unknown, {}, ICouponUsage, {}, {}> & ICouponUsage & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=coupon.model.d.ts.map