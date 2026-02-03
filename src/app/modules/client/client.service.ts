import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Client } from "./client.model";
import { IClient } from "./client.interface";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const sanitizeOptionalString = (value?: string | null) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const normalizeSortOrder = (value: unknown, fallback: number) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
};

const normalizeBoolean = (value: unknown, fallback: boolean) => {
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
const createClientIntoDB = async (
  payload: Partial<IClient>,
  file: Express.Multer.File
) => {
  if (payload.name) {
    payload.name = payload.name.trim();
  }

  payload.website = sanitizeOptionalString(payload.website ?? undefined);
  payload.description = sanitizeOptionalString(
    payload.description ?? undefined
  );
  payload.sortOrder = normalizeSortOrder(payload.sortOrder, 0);
  payload.isActive = normalizeBoolean(payload.isActive, true);

  // Upload logo to Cloudinary
  const uploadResult = await uploadToCloudinary(
    file.buffer,
    `clients/${Date.now()}`
  );

  if (!uploadResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "Logo upload failed");
  }

  payload.logo = uploadResult;

  const result = await Client.create(payload);
  return result;
};

// Get all active clients for public display
const getActiveClientsFromDB = async () => {
  const result = await Client.find({ isActive: true }).sort({ sortOrder: 1 });
  return result;
};

// Get all clients (admin)
const getAllClientsFromDB = async () => {
  const result = await Client.find().sort({ sortOrder: 1 });
  return result;
};

// Get single client by ID
const getSingleClientFromDB = async (id: string) => {
  const result = await Client.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  return result;
};

// Update client
const updateClientIntoDB = async (
  id: string,
  payload: Partial<IClient>,
  file?: Express.Multer.File
) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  if (payload.name) {
    payload.name = payload.name.trim();
  }

  payload.website = sanitizeOptionalString(payload.website ?? client.website);
  payload.description = sanitizeOptionalString(
    payload.description ?? client.description ?? undefined
  );
  payload.sortOrder = normalizeSortOrder(payload.sortOrder, client.sortOrder);
  payload.isActive = normalizeBoolean(payload.isActive, client.isActive);

  // Upload new logo if provided
  if (file) {
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      `clients/${Date.now()}`
    );

    if (!uploadResult) {
      throw new AppError(httpStatus.BAD_REQUEST, "Logo upload failed");
    }

    payload.logo = uploadResult;
  }

  const result = await Client.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete client
const deleteClientFromDB = async (id: string) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const result = await Client.findByIdAndDelete(id);
  return result;
};

// Toggle client active status
const toggleClientStatus = async (id: string) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const result = await Client.findByIdAndUpdate(
    id,
    { isActive: !client.isActive },
    { new: true }
  );

  return result;
};

export const ClientService = {
  createClientIntoDB,
  getActiveClientsFromDB,
  getAllClientsFromDB,
  getSingleClientFromDB,
  updateClientIntoDB,
  deleteClientFromDB,
  toggleClientStatus,
};
