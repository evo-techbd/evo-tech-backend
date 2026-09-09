import { Document } from "mongoose";

export interface IDeliveryChargeSettings extends Document {
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  additionalChargePerKg: number;
  createdAt?: Date;
  updatedAt?: Date;
}
