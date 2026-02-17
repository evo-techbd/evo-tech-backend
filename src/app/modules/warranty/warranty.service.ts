import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Warranty } from "./warranty.model";
import { IWarranty } from "./warranty.interface";

// Create or update warranty information (only one active at a time)
const createOrUpdateWarrantyIntoDB = async (payload: Partial<IWarranty>) => {
  // Deactivate all existing warranty information
  await Warranty.updateMany({}, { isActive: false });

  // Create new warranty information
  const result = await Warranty.create({ ...payload, isActive: true });
  return result;
};

// Get active warranty information (public)
const getActiveWarrantyFromDB = async () => {
  const result = await Warranty.findOne({ isActive: true }).sort({ updatedAt: -1 });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Warranty information not found");
  }

  return result;
};

// Get all warranty information history (admin)
const getAllWarrantyFromDB = async () => {
  const result = await Warranty.find().sort({ updatedAt: -1 });
  return result;
};

// Get single warranty information by ID
const getSingleWarrantyFromDB = async (id: string) => {
  const result = await Warranty.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Warranty information not found");
  }

  return result;
};

// Update warranty information
const updateWarrantyIntoDB = async (id: string, payload: Partial<IWarranty>) => {
  const warranty = await Warranty.findById(id);

  if (!warranty) {
    throw new AppError(httpStatus.NOT_FOUND, "Warranty information not found");
  }

  // If setting this version as active, deactivate all others
  if (payload.isActive === true) {
    await Warranty.updateMany({ _id: { $ne: id } }, { isActive: false });
  }

  const result = await Warranty.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete warranty information
const deleteWarrantyFromDB = async (id: string) => {
  const warranty = await Warranty.findById(id);

  if (!warranty) {
    throw new AppError(httpStatus.NOT_FOUND, "Warranty information not found");
  }

  // Don't allow deletion of active warranty information
  if (warranty.isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete active warranty information. Please activate another version first."
    );
  }

  const result = await Warranty.findByIdAndDelete(id);
  return result;
};

export const WarrantyService = {
  createOrUpdateWarrantyIntoDB,
  getActiveWarrantyFromDB,
  getAllWarrantyFromDB,
  getSingleWarrantyFromDB,
  updateWarrantyIntoDB,
  deleteWarrantyFromDB,
};
