import { TUser } from "./user.interface";
export declare const UserServices: {
    getAllUsersFromDB: (query: Record<string, unknown>) => Promise<{
        result: (import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
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
    getSingleUserFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    getSingleUserByUuidFromDB: (uuid: string) => Promise<(import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    updateUserIntoDB: (payload: Partial<TUser>, id: string) => Promise<(import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteUserFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    getUserDashboardStatsFromDB: (userUuid: string) => Promise<{
        totalOrders: number;
        totalSpent: number;
        recentOrders: {
            _id: any;
            orderNumber: any;
            totalPayable: any;
            orderStatus: any;
            paymentStatus: any;
            createdAt: any;
            itemsCount: any;
            lineItemsCount: any;
        }[];
        rewardPoints: number;
        memberSince: Date | undefined;
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
    createStaffIntoDB: (payload: Partial<TUser>) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, {}> & TUser & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map