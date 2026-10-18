import { Document } from "mongoose";

export interface IDeliveryChargeSettings extends Document {
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  additionalChargePerKg: number;
  expressInsideDhakaCharge: number;
  expressOutsideDhakaCharge: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactSettings extends Document {
  email: string;
  phones: string[];
  whatsapp: string;
  address: string;
  // One "Label: value" entry per line, e.g. "Friday: Closed"
  businessHours: string;
  mapUrl: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  createdAt?: Date;
  updatedAt?: Date;
}
