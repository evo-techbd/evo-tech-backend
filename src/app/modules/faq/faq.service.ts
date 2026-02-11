import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Faq } from "./faq.model";
import { IFaq } from "./faq.interface";

// Create FAQ
const createFaqIntoDB = async (payload: Partial<IFaq>) => {
  const result = await Faq.create(payload);
  return result;
};

// Get all active FAQs (public)
const getActiveFaqsFromDB = async () => {
  const result = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  return result;
};

// Get all FAQs (admin)
const getAllFaqsFromDB = async () => {
  const result = await Faq.find().sort({ order: 1, createdAt: -1 });
  return result;
};

// Get single FAQ by ID
const getSingleFaqFromDB = async (id: string) => {
  const result = await Faq.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  return result;
};

// Update FAQ
const updateFaqIntoDB = async (id: string, payload: Partial<IFaq>) => {
  const faq = await Faq.findById(id);

  if (!faq) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete FAQ
const deleteFaqFromDB = async (id: string) => {
  const faq = await Faq.findById(id);

  if (!faq) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  const result = await Faq.findByIdAndDelete(id);
  return result;
};

export const FaqService = {
  createFaqIntoDB,
  getActiveFaqsFromDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
  updateFaqIntoDB,
  deleteFaqFromDB,
};
