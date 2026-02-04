import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { PermissionServices } from "./permission.service";

const getAllPermissions = catchAsync(async (req, res) => {
  const result = await PermissionServices.getAllPermissionsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions retrieved successfully!",
    data: result,
  });
});

const getStaffPermissions = catchAsync(async (req, res) => {
  const { userUuid } = req.params;
  const result = await PermissionServices.getStaffPermissionsFromDB(userUuid);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff permissions retrieved successfully!",
    data: result,
  });
});

const assignPermissions = catchAsync(async (req, res) => {
  const { userUuid } = req.params;
  const adminUuid = req.user?.uuid;
  
  if (!adminUuid) {
    throw new Error("Admin UUID not found");
  }
  
  const result = await PermissionServices.assignPermissionsToStaff(userUuid, {
    permissions: req.body.permissions,
    grantedBy: adminUuid,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions assigned successfully!",
    data: result,
  });
});

const getMyPermissions = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  
  const result = await PermissionServices.getStaffPermissionsFromDB(userUuid);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your permissions retrieved successfully!",
    data: result,
  });
});

const getPermittedRoutes = catchAsync(async (req, res) => {
  const userUuid = req.user?.uuid;
  
  if (!userUuid) {
    throw new Error("User UUID not found");
  }
  
  const result = await PermissionServices.getPermittedRoutesForUser(userUuid);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permitted routes retrieved successfully!",
    data: { routes: result },
  });
});

export const PermissionControllers = {
  getAllPermissions,
  getStaffPermissions,
  assignPermissions,
  getMyPermissions,
  getPermittedRoutes,
};
