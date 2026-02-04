import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { LandingSection } from "./landingsection.model";
import { ILandingSection } from "./landingsection.interface";

// Create a new landing section
const createLandingSectionIntoDB = async (
  payload: Partial<ILandingSection>
) => {
  const result = await LandingSection.create(payload);
  return result;
};

// Get all active landing sections with populated products
const getActiveLandingSectionsFromDB = async () => {
  const result = await LandingSection.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate({
      path: "products",
      select: "name slug price salePrice mainImage rating stockStatus",
      match: { isActive: true },
    });

  return result;
};

// Get all landing sections (admin)
const getAllLandingSectionsFromDB = async () => {
  const result = await LandingSection.find()
    .sort({ sortOrder: 1 })
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate({
      path: "products",
      select: "name slug price salePrice mainImage rating stockStatus",
    });

  return result;
};

// Get single landing section by ID
const getSingleLandingSectionFromDB = async (id: string) => {
  const result = await LandingSection.findById(id)
    .populate("category")
    .populate("subcategory")
    .populate("products");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Landing section not found");
  }

  return result;
};

// Update landing section
const updateLandingSectionIntoDB = async (
  id: string,
  payload: Partial<ILandingSection>
) => {
  const section = await LandingSection.findById(id);

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Landing section not found");
  }

  const result = await LandingSection.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete landing section
const deleteLandingSectionFromDB = async (id: string) => {
  const section = await LandingSection.findById(id);

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Landing section not found");
  }

  const result = await LandingSection.findByIdAndDelete(id);
  return result;
};

// Toggle landing section status
const toggleLandingSectionStatus = async (id: string) => {
  const section = await LandingSection.findById(id);

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Landing section not found");
  }

  const result = await LandingSection.findByIdAndUpdate(
    id,
    { isActive: !section.isActive },
    { new: true }
  );

  return result;
};

export const LandingSectionService = {
  createLandingSectionIntoDB,
  getActiveLandingSectionsFromDB,
  getAllLandingSectionsFromDB,
  getSingleLandingSectionFromDB,
  updateLandingSectionIntoDB,
  deleteLandingSectionFromDB,
  toggleLandingSectionStatus,
};
