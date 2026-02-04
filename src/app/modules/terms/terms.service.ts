import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Terms } from "./terms.model";
import { ITerms } from "./terms.interface";

// Create or update terms and conditions (only one active at a time)
const createOrUpdateTermsIntoDB = async (payload: Partial<ITerms>) => {
  // Deactivate all existing terms
  await Terms.updateMany({}, { isActive: false });

  // Create new terms
  const result = await Terms.create({ ...payload, isActive: true });
  return result;
};

// Get active terms and conditions (public)
const getActiveTermsFromDB = async () => {
  const result = await Terms.findOne({ isActive: true }).sort({ updatedAt: -1 });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms and conditions not found");
  }

  return result;
};

// Get all terms history (admin)
const getAllTermsFromDB = async () => {
  const result = await Terms.find().sort({ updatedAt: -1 });
  return result;
};

// Get single terms by ID
const getSingleTermsFromDB = async (id: string) => {
  const result = await Terms.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms and conditions not found");
  }

  return result;
};

// Update terms
const updateTermsIntoDB = async (id: string, payload: Partial<ITerms>) => {
  const terms = await Terms.findById(id);

  if (!terms) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms and conditions not found");
  }

  // If setting this version as active, deactivate all others
  if (payload.isActive === true) {
    await Terms.updateMany({ _id: { $ne: id } }, { isActive: false });
  }

  const result = await Terms.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete terms
const deleteTermsFromDB = async (id: string) => {
  const terms = await Terms.findById(id);

  if (!terms) {
    throw new AppError(httpStatus.NOT_FOUND, "Terms and conditions not found");
  }

  // Don't allow deletion of active terms
  if (terms.isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete active terms and conditions. Please activate another version first."
    );
  }

  const result = await Terms.findByIdAndDelete(id);
  return result;
};

export const TermsService = {
  createOrUpdateTermsIntoDB,
  getActiveTermsFromDB,
  getAllTermsFromDB,
  getSingleTermsFromDB,
  updateTermsIntoDB,
  deleteTermsFromDB,
};
