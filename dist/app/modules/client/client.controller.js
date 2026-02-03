"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const client_service_1 = require("./client.service");
const catchAsync_1 = require("../../utils/catchAsync");
// Create client
const createClient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Client logo is required",
            data: null,
        });
    }
    const result = await client_service_1.ClientService.createClientIntoDB(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Client created successfully",
        data: result,
    });
});
// Get active clients (public)
const getActiveClients = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await client_service_1.ClientService.getActiveClientsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active clients retrieved successfully",
        data: result,
    });
});
// Get all clients (admin)
const getAllClients = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await client_service_1.ClientService.getAllClientsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All clients retrieved successfully",
        data: result,
    });
});
// Get single client
const getSingleClient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await client_service_1.ClientService.getSingleClientFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client retrieved successfully",
        data: result,
    });
});
// Update client
const updateClient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file;
    const result = await client_service_1.ClientService.updateClientIntoDB(req.params.id, req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client updated successfully",
        data: result,
    });
});
// Delete client
const deleteClient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await client_service_1.ClientService.deleteClientFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client deleted successfully",
        data: result,
    });
});
// Toggle client status
const toggleClientStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await client_service_1.ClientService.toggleClientStatus(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Client status toggled successfully",
        data: result,
    });
});
exports.ClientController = {
    createClient,
    getActiveClients,
    getAllClients,
    getSingleClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
};
//# sourceMappingURL=client.controller.js.map