import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { PageContent } from "./page-content.model";
import { IPageContent, PageContentType } from "./page-content.interface";

// Create new page content (deactivates previous active of same type)
const createPageContentIntoDB = async (
  type: PageContentType,
  payload: Partial<IPageContent>
) => {
  // Deactivate all existing content of same type
  await PageContent.updateMany({ type }, { isActive: false });

  // Create new content
  const result = await PageContent.create({ ...payload, type, isActive: true });
  return result;
};

// Get active content by type (public)
const getActivePageContentFromDB = async (type: PageContentType) => {
  const result = await PageContent.findOne({ type, isActive: true }).sort({
    updatedAt: -1,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `${type} content not found`);
  }

  return result;
};

// Get all content history by type (admin)
const getAllPageContentFromDB = async (type: PageContentType) => {
  const result = await PageContent.find({ type }).sort({ updatedAt: -1 });
  return result;
};

// Get single content by ID
const getSinglePageContentFromDB = async (id: string) => {
  const result = await PageContent.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  return result;
};

// Update content
const updatePageContentIntoDB = async (
  id: string,
  payload: Partial<IPageContent>
) => {
  const content = await PageContent.findById(id);

  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // If setting this version as active, deactivate all others of same type
  if (payload.isActive === true) {
    await PageContent.updateMany(
      { type: content.type, _id: { $ne: id } },
      { isActive: false }
    );
  }

  const result = await PageContent.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete content
const deletePageContentFromDB = async (id: string) => {
  const content = await PageContent.findById(id);

  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // Don't allow deletion of active content
  if (content.isActive) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete active content. Please activate another version first."
    );
  }

  const result = await PageContent.findByIdAndDelete(id);
  return result;
};

export const PageContentService = {
  createPageContentIntoDB,
  getActivePageContentFromDB,
  getAllPageContentFromDB,
  getSinglePageContentFromDB,
  updatePageContentIntoDB,
  deletePageContentFromDB,
};
