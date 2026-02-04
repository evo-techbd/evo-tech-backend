import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Banner } from "./banner.model";
import { IBanner } from "./banner.interface";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

// Create a new banner
const createBannerIntoDB = async (
  payload: Partial<IBanner>,
  file: Express.Multer.File
) => {
  // Upload image to Cloudinary
  const uploadResult = await uploadToCloudinary(
    file.buffer,
    `banners/${Date.now()}`
  );

  if (!uploadResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "Image upload failed");
  }

  payload.image = uploadResult;

  const result = await Banner.create(payload);
  return result;
};

// Get all active banners for public display
const getActiveBannersFromDB = async () => {
  const result = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
  return result;
};

// Get all banners (admin)
const getAllBannersFromDB = async () => {
  const result = await Banner.find().sort({ sortOrder: 1 });
  return result;
};

// Get single banner by ID
const getSingleBannerFromDB = async (id: string) => {
  const result = await Banner.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }

  return result;
};

// Update banner
const updateBannerIntoDB = async (
  id: string,
  payload: Partial<IBanner>,
  file?: Express.Multer.File
) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }

  // Upload new image if provided
  if (file) {
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      `banners/${Date.now()}`
    );

    if (!uploadResult) {
      throw new AppError(httpStatus.BAD_REQUEST, "Image upload failed");
    }

    payload.image = uploadResult;
  }

  const result = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete banner
const deleteBannerFromDB = async (id: string) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }

  const result = await Banner.findByIdAndDelete(id);
  return result;
};

// Toggle banner active status
const toggleBannerStatus = async (id: string) => {
  const banner = await Banner.findById(id);

  if (!banner) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }

  const result = await Banner.findByIdAndUpdate(
    id,
    { isActive: !banner.isActive },
    { new: true }
  );

  return result;
};

export const BannerService = {
  createBannerIntoDB,
  getActiveBannersFromDB,
  getAllBannersFromDB,
  getSingleBannerFromDB,
  updateBannerIntoDB,
  deleteBannerFromDB,
  toggleBannerStatus,
};
