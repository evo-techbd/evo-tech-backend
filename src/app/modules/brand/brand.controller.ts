import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BrandServices } from "./brand.service";

const getAllBrands = catchAsync(async (req, res) => {
  const brands = await BrandServices.getAllBrandsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brands Retrieved Successfully",
    data: brands.result,
    meta: brands.meta,
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const brand = await BrandServices.getSingleBrandFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand Retrieved Successfully",
    data: brand,
  });
});

const getBrandBySlug = catchAsync(async (req, res) => {
  const brand = await BrandServices.getBrandBySlugFromDB(req.params.slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand Retrieved Successfully",
    data: brand,
  });
});

const createBrand = catchAsync(async (req, res) => {
  const logoBuffer = req.file?.buffer;
  const result = await BrandServices.createBrandIntoDB(req.body, logoBuffer);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Brand created successfully",
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const logoBuffer = req.file?.buffer;
  const result = await BrandServices.updateBrandIntoDB(
    id,
    req.body,
    logoBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  await BrandServices.deleteBrandFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Brand deleted successfully",
    data: null,
  });
});

export const BrandControllers = {
  getAllBrands,
  getSingleBrand,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
