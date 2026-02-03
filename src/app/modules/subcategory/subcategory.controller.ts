import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubcategoryServices } from "./subcategory.service";

const getAllSubcategories = catchAsync(async (req, res) => {
  const subcategories = await SubcategoryServices.getAllSubcategoriesFromDB(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategories Retrieved Successfully",
    data: subcategories.result,
    meta: subcategories.meta,
  });
});

const getSingleSubcategory = catchAsync(async (req, res) => {
  const subcategory = await SubcategoryServices.getSingleSubcategoryFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory Retrieved Successfully",
    data: subcategory,
  });
});

const getSubcategoryBySlug = catchAsync(async (req, res) => {
  const subcategory = await SubcategoryServices.getSubcategoryBySlugFromDB(
    req.params.slug
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory Retrieved Successfully",
    data: subcategory,
  });
});

const createSubcategory = catchAsync(async (req, res) => {
  const imageBuffer = req.file?.buffer;
  const result = await SubcategoryServices.createSubcategoryIntoDB(
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subcategory created successfully",
    data: result,
  });
});

const updateSubcategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await SubcategoryServices.updateSubcategoryIntoDB(
    id,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory updated successfully",
    data: result,
  });
});

const deleteSubcategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SubcategoryServices.deleteSubcategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory deleted successfully",
    data: null,
  });
});

export const SubcategoryControllers = {
  getAllSubcategories,
  getSingleSubcategory,
  getSubcategoryBySlug,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
