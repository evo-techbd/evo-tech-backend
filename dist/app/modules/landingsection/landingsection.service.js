"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingSectionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const landingsection_model_1 = require("./landingsection.model");
// Create a new landing section
const createLandingSectionIntoDB = async (payload) => {
    const result = await landingsection_model_1.LandingSection.create(payload);
    return result;
};
// Get all active landing sections with populated products
const getActiveLandingSectionsFromDB = async () => {
    const result = await landingsection_model_1.LandingSection.find({ isActive: true })
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
    const result = await landingsection_model_1.LandingSection.find()
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
const getSingleLandingSectionFromDB = async (id) => {
    const result = await landingsection_model_1.LandingSection.findById(id)
        .populate("category")
        .populate("subcategory")
        .populate("products");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Landing section not found");
    }
    return result;
};
// Update landing section
const updateLandingSectionIntoDB = async (id, payload) => {
    const section = await landingsection_model_1.LandingSection.findById(id);
    if (!section) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Landing section not found");
    }
    const result = await landingsection_model_1.LandingSection.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// Delete landing section
const deleteLandingSectionFromDB = async (id) => {
    const section = await landingsection_model_1.LandingSection.findById(id);
    if (!section) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Landing section not found");
    }
    const result = await landingsection_model_1.LandingSection.findByIdAndDelete(id);
    return result;
};
// Toggle landing section status
const toggleLandingSectionStatus = async (id) => {
    const section = await landingsection_model_1.LandingSection.findById(id);
    if (!section) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Landing section not found");
    }
    const result = await landingsection_model_1.LandingSection.findByIdAndUpdate(id, { isActive: !section.isActive }, { new: true });
    return result;
};
exports.LandingSectionService = {
    createLandingSectionIntoDB,
    getActiveLandingSectionsFromDB,
    getAllLandingSectionsFromDB,
    getSingleLandingSectionFromDB,
    updateLandingSectionIntoDB,
    deleteLandingSectionFromDB,
    toggleLandingSectionStatus,
};
//# sourceMappingURL=landingsection.service.js.map