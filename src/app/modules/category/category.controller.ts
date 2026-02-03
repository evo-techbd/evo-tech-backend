import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await CategoryServices.getAllCategoriesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories Retrieved Successfully",
    data: categories.result,
    meta: categories.meta,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.getSingleCategoryFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Retrieved Successfully",
    data: category,
  });
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await CategoryServices.getCategoryBySlugFromDB(
    req.params.slug
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category Retrieved Successfully",
    data: category,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const imageBuffer = (req.file as Express.Multer.File)?.buffer;
  
  const result = await CategoryServices.createCategoryIntoDB(
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const imageBuffer = (req.file as Express.Multer.File)?.buffer;
  
  const result = await CategoryServices.updateCategoryIntoDB(
    id,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CategoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryControllers = {
  getAllCategories,
  getSingleCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
