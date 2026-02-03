import { Types } from "mongoose";
import { TNotification } from "./notification.interface";
export declare const NotificationServices: {
    getStockNotificationsFromDB: (query: Record<string, unknown>) => Promise<{
        result: (import("mongoose").Document<unknown, {}, TNotification, {}, {}> & TNotification & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markNotificationAsReadIntoDB: (id: string, readerId?: string) => Promise<(import("mongoose").Document<unknown, {}, TNotification, {}, {}> & TNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    resolveNotificationIntoDB: (id: string, resolverId?: string) => Promise<import("mongoose").Document<unknown, {}, TNotification, {}, {}> & TNotification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    evaluateStockForProduct: (productId: Types.ObjectId | string) => Promise<true | null>;
};
//# sourceMappingURL=notification.service.d.ts.map