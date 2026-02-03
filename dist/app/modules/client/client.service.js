"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_model_1 = require("./client.model");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const sanitizeOptionalString = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
};
const normalizeSortOrder = (value, fallback) => {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
        return fallback;
    }
    return parsed;
};
const normalizeBoolean = (value, fallback) => {
    if (value === null || value === undefined) {
        return fallback;
    }
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "number") {
        return value === 1;
    }
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(normalized)) {
            return true;
        }
        if (["false", "0", "no", "off"].includes(normalized)) {
            return false;
        }
    }
    return fallback;
};
// Create a new client
const createClientIntoDB = async (payload, file) => {
    if (payload.name) {
        payload.name = payload.name.trim();
    }
    payload.website = sanitizeOptionalString(payload.website ?? undefined);
    payload.description = sanitizeOptionalString(payload.description ?? undefined);
    payload.sortOrder = normalizeSortOrder(payload.sortOrder, 0);
    payload.isActive = normalizeBoolean(payload.isActive, true);
    // Upload logo to Cloudinary
    const uploadResult = await (0, cloudinaryUpload_1.uploadToCloudinary)(file.buffer, `clients/${Date.now()}`);
    if (!uploadResult) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Logo upload failed");
    }
    payload.logo = uploadResult;
    const result = await client_model_1.Client.create(payload);
    return result;
};
// Get all active clients for public display
const getActiveClientsFromDB = async () => {
    const result = await client_model_1.Client.find({ isActive: true }).sort({ sortOrder: 1 });
    return result;
};
// Get all clients (admin)
const getAllClientsFromDB = async () => {
    const result = await client_model_1.Client.find().sort({ sortOrder: 1 });
    return result;
};
// Get single client by ID
const getSingleClientFromDB = async (id) => {
    const result = await client_model_1.Client.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    return result;
};
// Update client
const updateClientIntoDB = async (id, payload, file) => {
    const client = await client_model_1.Client.findById(id);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    if (payload.name) {
        payload.name = payload.name.trim();
    }
    payload.website = sanitizeOptionalString(payload.website ?? client.website);
    payload.description = sanitizeOptionalString(payload.description ?? client.description ?? undefined);
    payload.sortOrder = normalizeSortOrder(payload.sortOrder, client.sortOrder);
    payload.isActive = normalizeBoolean(payload.isActive, client.isActive);
    // Upload new logo if provided
    if (file) {
        const uploadResult = await (0, cloudinaryUpload_1.uploadToCloudinary)(file.buffer, `clients/${Date.now()}`);
        if (!uploadResult) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Logo upload failed");
        }
        payload.logo = uploadResult;
    }
    const result = await client_model_1.Client.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete client
const deleteClientFromDB = async (id) => {
    const client = await client_model_1.Client.findById(id);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    const result = await client_model_1.Client.findByIdAndDelete(id);
    return result;
};
// Toggle client active status
const toggleClientStatus = async (id) => {
    const client = await client_model_1.Client.findById(id);
    if (!client) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Client not found");
    }
    const result = await client_model_1.Client.findByIdAndUpdate(id, { isActive: !client.isActive }, { new: true });
    return result;
};
exports.ClientService = {
    createClientIntoDB,
    getActiveClientsFromDB,
    getAllClientsFromDB,
    getSingleClientFromDB,
    updateClientIntoDB,
    deleteClientFromDB,
    toggleClientStatus,
};
//# sourceMappingURL=client.service.js.map