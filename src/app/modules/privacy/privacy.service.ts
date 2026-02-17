import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Privacy } from "./privacy.model";
import { IPrivacy } from "./privacy.interface";

// Create or update privacy policy (only one active at a time)
const createOrUpdatePrivacyIntoDB = async (payload: Partial<IPrivacy>) => {
  // Deactivate all existing privacy policies
  await Privacy.updateMany({}, { isActive: false });

  // Create new privacy policy
  const result = await Privacy.create({ ...payload, isActive: true });
  return result;
};

// Get active privacy policy (public)
const getActivePrivacyFromDB = async () => {
  const result = await Privacy.findOne({ isActive: true }).sort({ updatedAt: -1 });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Privacy policy not found");
  }

  return result;
};

// Get all privacy policies history (admin)
const getAllPrivacyFromDB = async () => {
  const result = await Privacy.find().sort({ updatedAt: -1 });
  return result;
};

// Get single privacy policy by ID
const getSinglePrivacyFromDB = async (id: string) => {
  const result = await Privacy.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Privacy policy not found");
  }

  return result;
};

// Update privacy policy
const updatePrivacyIntoDB = async (id: string, payload: Partial<IPrivacy>) => {
  const privacy = await Privacy.findById(id);

  if (!privacy) {
    throw new AppError(httpStatus.NOT_FOUND, "Privacy policy not found");
  }

  // If setting this version as active, deactivate all others
  if (payload.isActive === true) {
    await Privacy.updateMany({ _id: { $ne: id } }, { isActive: false });
  }

  const result = await Privacy.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete privacy policy
const deletePrivacyFromDB = async (id: string) => {
  const privacy = await Privacy.findById(id);

  if (!privacy) {
    throw new AppError(httpStatus.NOT_FOUND, "Privacy policy not found");
  }

  // Don't allow deletion of active privacy policy
  if (privacy.isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete active privacy policy. Please activate another version first."
    );
  }

  const result = await Privacy.findByIdAndDelete(id);
  return result;
};

export const PrivacyService = {
  createOrUpdatePrivacyIntoDB,
  getActivePrivacyFromDB,
  getAllPrivacyFromDB,
  getSinglePrivacyFromDB,
  updatePrivacyIntoDB,
  deletePrivacyFromDB,
};
