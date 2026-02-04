import { Types } from "mongoose";
export declare const PermissionServices: {
    getAllPermissionsFromDB: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, import("./permission.model").IPermission, {}, {}> & import("./permission.model").IPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getStaffPermissionsFromDB: (userIdOrUuid: string) => Promise<{
        user: string;
        permissions: never[];
        permittedRoutes: never[];
        userId?: undefined;
        permissionCodes?: undefined;
        grantedBy?: undefined;
    } | {
        user: string;
        userId: string;
        permissions: (import("mongoose").Document<unknown, {}, import("./permission.model").IPermission, {}, {}> & import("./permission.model").IPermission & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        permissionCodes: string[];
        permittedRoutes: string[];
        grantedBy: Types.ObjectId;
    }>;
    assignPermissionsToStaff: (userIdOrUuid: string, payload: {
        permissions: string[];
        grantedBy: string;
    }) => Promise<import("mongoose").Document<unknown, {}, import("./staff-permission.model").IStaffPermission, {}, {}> & import("./staff-permission.model").IStaffPermission & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    checkUserPermission: (userIdOrUuid: string, permissionCode: string) => Promise<boolean>;
    checkUserHasAnyPermission: (userIdOrUuid: string, permissionCodes: string[]) => Promise<boolean>;
    getPermittedRoutesForUser: (userIdOrUuid: string) => Promise<string[]>;
};
//# sourceMappingURL=permission.service.d.ts.map