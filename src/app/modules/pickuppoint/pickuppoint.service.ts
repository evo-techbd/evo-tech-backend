import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { PickupPoint } from "./pickuppoint.model";
import { IPickupPoint } from "./pickuppoint.interface";

// Create a new pickup point
const createPickupPointIntoDB = async (payload: Partial<IPickupPoint>) => {
  const result = await PickupPoint.create(payload);
  return result;
};

// Get all active pickup points for public display
const getActivePickupPointsFromDB = async () => {
  const result = await PickupPoint.find({ isActive: true }).sort({
    sortOrder: 1,
  });
  return result;
};

// Get all pickup points (admin)
const getAllPickupPointsFromDB = async () => {
  const result = await PickupPoint.find().sort({ sortOrder: 1 });
  return result;
};

// Get single pickup point by ID
const getSinglePickupPointFromDB = async (id: string) => {
  const result = await PickupPoint.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Pickup point not found");
  }

  return result;
};

// Update pickup point
const updatePickupPointIntoDB = async (
  id: string,
  payload: Partial<IPickupPoint>,
) => {
  const pickupPoint = await PickupPoint.findById(id);

  if (!pickupPoint) {
    throw new AppError(httpStatus.NOT_FOUND, "Pickup point not found");
  }

  const result = await PickupPoint.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete pickup point
const deletePickupPointFromDB = async (id: string) => {
  const pickupPoint = await PickupPoint.findById(id);

  if (!pickupPoint) {
    throw new AppError(httpStatus.NOT_FOUND, "Pickup point not found");
  }

  const result = await PickupPoint.findByIdAndDelete(id);
  return result;
};

// Toggle pickup point active status
const togglePickupPointStatus = async (id: string) => {
  const pickupPoint = await PickupPoint.findById(id);

  if (!pickupPoint) {
    throw new AppError(httpStatus.NOT_FOUND, "Pickup point not found");
  }

  const result = await PickupPoint.findByIdAndUpdate(
    id,
    { isActive: !pickupPoint.isActive },
    { new: true },
  );

  return result;
};

export const PickupPointService = {
  createPickupPointIntoDB,
  getActivePickupPointsFromDB,
  getAllPickupPointsFromDB,
  getSinglePickupPointFromDB,
  updatePickupPointIntoDB,
  deletePickupPointFromDB,
  togglePickupPointStatus,
};
