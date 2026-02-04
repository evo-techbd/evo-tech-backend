export interface TPermission {
    name: string;
    code: string;
    category: string;
    description?: string;
    isActive?: boolean;
}
export interface TStaffPermission {
    user: string;
    permissions: string[];
    grantedBy?: string;
}
//# sourceMappingURL=permission.interface.d.ts.map