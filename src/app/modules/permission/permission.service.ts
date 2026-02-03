import { Permission } from "./permission.model";
import { StaffPermission } from "./staff-permission.model";
import { TPermission, TStaffPermission } from "./permission.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Types } from "mongoose";

// Get all permissions
const getAllPermissionsFromDB = async (query: Record<string, unknown>) => {
  const { category } = query;
  
  const searchQuery: any = { isActive: true };
  
  if (category) {
    searchQuery.category = category;
  }
  
  const permissions = await Permission.find(searchQuery).sort({ category: 1, name: 1 });
  
  return permissions;
};

// Get permissions for a specific staff member
const getStaffPermissionsFromDB = async (userIdOrUuid: string) => {
  // Try to find by ObjectId first, then by uuid if not found
  let userId: Types.ObjectId | null = null;
  
  if (Types.ObjectId.isValid(userIdOrUuid)) {
    userId = new Types.ObjectId(userIdOrUuid);
  } else {
    // If not a valid ObjectId, assume it's a UUID and look up the user
    const User = require('../user/user.model').User;
    const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
    if (user) {
      userId = user._id;
    }
  }
  
  if (!userId) {
    return {
      user: userIdOrUuid,
      permissions: [],
      permittedRoutes: [],
    };
  }
  
  const staffPermission = await StaffPermission.findOne({ user: userId });
  
  if (!staffPermission) {
    return {
      user: userIdOrUuid,
      permissions: [],
      permittedRoutes: [],
    };
  }
  
  // Get full permission details
  const permissions = await Permission.find({
    code: { $in: staffPermission.permissions },
    isActive: true,
  });
  
  // Extract unique routes from permissions
  const permittedRoutes = [...new Set(permissions.map(p => p.route))];
  
  return {
    user: userIdOrUuid,
    userId: userId.toString(),
    permissions: permissions,
    permissionCodes: staffPermission.permissions,
    permittedRoutes: permittedRoutes, // Array of route strings
    grantedBy: staffPermission.grantedBy,
  };
};

// Assign permissions to staff member
const assignPermissionsToStaff = async (
  userIdOrUuid: string,
  payload: { permissions: string[]; grantedBy: string }
) => {
  // Verify all permission codes exist
  const validPermissions = await Permission.find({
    code: { $in: payload.permissions },
    isActive: true,
  });
  
  if (validPermissions.length !== payload.permissions.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Some permission codes are invalid");
  }
  
  // Convert userIdOrUuid to ObjectId
  let userId: Types.ObjectId;
  let grantedById: Types.ObjectId;
  
  if (Types.ObjectId.isValid(userIdOrUuid)) {
    userId = new Types.ObjectId(userIdOrUuid);
  } else {
    // Look up user by UUID
    const User = require('../user/user.model').User;
    const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    userId = user._id;
  }
  
  // Convert grantedBy to ObjectId
  if (Types.ObjectId.isValid(payload.grantedBy)) {
    grantedById = new Types.ObjectId(payload.grantedBy);
  } else {
    const User = require('../user/user.model').User;
    const admin = await User.findOne({ uuid: payload.grantedBy }).select('_id');
    if (!admin) {
      throw new AppError(httpStatus.NOT_FOUND, "Admin user not found");
    }
    grantedById = admin._id;
  }
  
  // Update or create staff permissions
  const result = await StaffPermission.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      permissions: payload.permissions,
      grantedBy: grantedById,
    },
    {
      new: true,
      upsert: true,
    }
  );
  
  return result;
};

// Check if user has specific permission
const checkUserPermission = async (userIdOrUuid: string, permissionCode: string): Promise<boolean> => {
  let userId: Types.ObjectId | null = null;
  
  if (Types.ObjectId.isValid(userIdOrUuid)) {
    userId = new Types.ObjectId(userIdOrUuid);
  } else {
    const User = require('../user/user.model').User;
    const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
    if (user) userId = user._id;
  }
  
  if (!userId) return false;
  
  const staffPermission = await StaffPermission.findOne({ user: userId });
  
  if (!staffPermission) {
    return false;
  }
  
  return staffPermission.permissions.includes(permissionCode);
};

// Check if user has any of the specified permissions
const checkUserHasAnyPermission = async (userIdOrUuid: string, permissionCodes: string[]): Promise<boolean> => {
  let userId: Types.ObjectId | null = null;
  
  if (Types.ObjectId.isValid(userIdOrUuid)) {
    userId = new Types.ObjectId(userIdOrUuid);
  } else {
    const User = require('../user/user.model').User;
    const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
    if (user) userId = user._id;
  }
  
  if (!userId) return false;
  
  const staffPermission = await StaffPermission.findOne({ user: userId });
  
  if (!staffPermission) {
    return false;
  }
  
  return permissionCodes.some(code => staffPermission.permissions.includes(code));
};

// Get only permitted routes for a user (lightweight for auth)
const getPermittedRoutesForUser = async (userIdOrUuid: string): Promise<string[]> => {
  
  let userId: Types.ObjectId | null = null;
  
  if (Types.ObjectId.isValid(userIdOrUuid)) {
    userId = new Types.ObjectId(userIdOrUuid);
  } else {
    const User = require('../user/user.model').User;
    const user = await User.findOne({ uuid: userIdOrUuid }).select('_id');
    if (user) {
      userId = user._id;
    }
  }
  
  if (!userId) {
    return [];
  }
  
  const staffPermission = await StaffPermission.findOne({ user: userId });
  
  if (!staffPermission) {
    return [];
  }
  
  // Get permissions and extract routes
  const permissions = await Permission.find({
    code: { $in: staffPermission.permissions },
    isActive: true,
  }).select('route');
  
  
  // Return unique routes
  const routes = [...new Set(permissions.map(p => p.route))];
  return routes;
};

export const PermissionServices = {
  getAllPermissionsFromDB,
  getStaffPermissionsFromDB,
  assignPermissionsToStaff,
  checkUserPermission,
  checkUserHasAnyPermission,
  getPermittedRoutesForUser,
};
