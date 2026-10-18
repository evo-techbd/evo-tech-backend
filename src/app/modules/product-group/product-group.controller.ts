import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductGroupService } from "./product-group.service";

// Create product group
const createProductGroup = catchAsync(async (req, res) => {
  const result = await ProductGroupService.createProductGroupIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product group created successfully",
    data: result,
  });
});

// Get all product groups (admin)
const getAllProductGroups = catchAsync(async (req, res) => {
  const result = await ProductGroupService.getAllProductGroupsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product groups retrieved successfully",
    data: result,
  });
});

// Get single product group (admin)
const getSingleProductGroup = catchAsync(async (req, res) => {
  const result = await ProductGroupService.getSingleProductGroupFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product group retrieved successfully",
    data: result,
  });
});

// Update product group
const updateProductGroup = catchAsync(async (req, res) => {
  const result = await ProductGroupService.updateProductGroupIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product group updated successfully",
    data: result,
  });
});

// Delete product group
const deleteProductGroup = catchAsync(async (req, res) => {
  const result = await ProductGroupService.deleteProductGroupFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product group deleted successfully",
    data: result,
  });
});

// Get the group a product belongs to (public, product details page)
const getGroupForProduct = catchAsync(async (req, res) => {
  const result = await ProductGroupService.getGroupForProductFromDB(
    req.params.productId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result
      ? "Product group retrieved successfully"
      : "Product is not in a group",
    data: result,
  });
});

export const ProductGroupController = {
  createProductGroup,
  getAllProductGroups,
  getSingleProductGroup,
  updateProductGroup,
  deleteProductGroup,
  getGroupForProduct,
};
