import { Document } from "mongoose";

export interface IWarranty extends Document {
  content: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
