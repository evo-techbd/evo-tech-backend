import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PageContentService } from "./page-content.service";

// Create page content
const createPageContent = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await PageContentService.createPageContentIntoDB(
    type as any,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${type} content created successfully`,
    data: result,
  });
});

// Get active content (public)
const getActivePageContent = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await PageContentService.getActivePageContentFromDB(
    type as any
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Active ${type} content retrieved successfully`,
    data: result,
  });
});

// Get all content history (admin)
const getAllPageContent = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await PageContentService.getAllPageContentFromDB(type as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `All ${type} content retrieved successfully`,
    data: result,
  });
});

// Get single content
const getSinglePageContent = catchAsync(async (req, res) => {
  const result = await PageContentService.getSinglePageContentFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content retrieved successfully",
    data: result,
  });
});

// Update content
const updatePageContent = catchAsync(async (req, res) => {
  const result = await PageContentService.updatePageContentIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content updated successfully",
    data: result,
  });
});

// Delete content
const deletePageContent = catchAsync(async (req, res) => {
  const result = await PageContentService.deletePageContentFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content deleted successfully",
    data: result,
  });
});

export const PageContentController = {
  createPageContent,
  getActivePageContent,
  getAllPageContent,
  getSinglePageContent,
  updatePageContent,
  deletePageContent,
};
