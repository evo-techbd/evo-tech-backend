import { TOrder, TOrderItem } from "./order.interface";
import { Types } from "mongoose";
export declare const normalizeOrderObject: (orderDoc: any) => any;
export declare const OrderServices: {
    placeOrderIntoDB: (payload: TOrder & {
        items: any[];
    }, userUuid: string) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    placeGuestOrderIntoDB: (payload: TOrder & {
        items: any[];
    }) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    linkGuestOrdersToUserIntoDB: (email: string, userUuid: string) => Promise<{
        linked: number;
        orders: string[];
    }>;
    getUserOrdersFromDB: (userUuid: string, query: Record<string, unknown>) => Promise<{
        result: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllOrdersFromDB: (query: Record<string, unknown>) => Promise<{
        result: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSingleOrderFromDB: (orderId: string, userUuid?: string) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    updateOrderStatusIntoDB: (orderId: string, payload: Partial<TOrder>) => Promise<(import("mongoose").Document<unknown, {}, TOrder, {}, {}> & TOrder & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteOrderFromDB: (orderId: string) => Promise<(import("mongoose").Document<unknown, {}, TOrder, {}, {}> & TOrder & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    trackOrderByTrackingCode: (trackingCode: string) => Promise<{
        order: {
            orderNumber: string;
            trackingCode: string | undefined;
            orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
            paymentStatus: "partial" | "pending" | "paid" | "failed" | "refunded";
            paymentMethod: string;
            shippingType: string;
            city: string;
            subtotal: number;
            discount: number;
            deliveryCharge: number;
            additionalCharge: number;
            totalPayable: number;
            createdAt: Date | undefined;
            deliveredAt: Date | undefined;
            customerName: string;
            phone: string;
        };
        items: {
            productName: string;
            quantity: number;
            selectedColor: string | undefined;
            subtotal: number;
            product: Types.ObjectId;
        }[];
    }>;
    getOrderItemsForReviewFromDB: (orderId: string, userUuid: string) => Promise<{
        order: {
            _id: string;
            orderNumber: string;
            orderStatus: "delivered";
            deliveredAt: Date | undefined;
        };
        items: {
            _id: string;
            product: Types.ObjectId;
            productName: string;
            productPrice: number;
            quantity: number;
            selectedColor: string | undefined;
            subtotal: number;
            hasReview: boolean;
        }[];
    }>;
};
//# sourceMappingURL=order.service.d.ts.map