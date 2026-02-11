import { Document } from "mongoose";

export interface IPrivacy extends Document {
  content: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
