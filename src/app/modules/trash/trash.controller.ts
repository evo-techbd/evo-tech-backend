import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TrashServices } from "./trash.service";
import { TTrashEntityType } from "./trash.interface";

const getTrashItems = catchAsync(async (req, res) => {
  const result = await TrashServices.getTrashItemsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trash items retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const getTrashStatistics = catchAsync(async (req, res) => {
  const stats = await TrashServices.getTrashStatisticsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trash statistics retrieved successfully",
    data: stats,
  });
});

const restoreTrashItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TrashServices.restoreTrashItemFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item restored successfully",
    data: result,
  });
});

const permanentlyDeleteTrashItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  await TrashServices.permanentlyDeleteTrashItemFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item permanently deleted",
    data: null,
  });
});

const clearTrash = catchAsync(async (req, res) => {
  const entityType = req.query.entityType as TTrashEntityType | undefined;
  const result = await TrashServices.clearTrashFromDB(entityType);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Trash cleared successfully (${result.deletedCount} items removed)`,
    data: null,
  });
});

export const TrashControllers = {
  getTrashItems,
  getTrashStatistics,
  restoreTrashItem,
  permanentlyDeleteTrashItem,
  clearTrash,
};
