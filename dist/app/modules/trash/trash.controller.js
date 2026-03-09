"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const trash_service_1 = require("./trash.service");
const getTrashItems = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await trash_service_1.TrashServices.getTrashItemsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Trash items retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const getTrashStatistics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await trash_service_1.TrashServices.getTrashStatisticsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Trash statistics retrieved successfully",
        data: stats,
    });
});
const restoreTrashItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await trash_service_1.TrashServices.restoreTrashItemFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Item restored successfully",
        data: result,
    });
});
const permanentlyDeleteTrashItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await trash_service_1.TrashServices.permanentlyDeleteTrashItemFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Item permanently deleted",
        data: null,
    });
});
const clearTrash = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const entityType = req.query.entityType;
    const result = await trash_service_1.TrashServices.clearTrashFromDB(entityType);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Trash cleared successfully (${result.deletedCount} items removed)`,
        data: null,
    });
});
exports.TrashControllers = {
    getTrashItems,
    getTrashStatistics,
    restoreTrashItem,
    permanentlyDeleteTrashItem,
    clearTrash,
};
//# sourceMappingURL=trash.controller.js.map