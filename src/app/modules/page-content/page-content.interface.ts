import { Document } from "mongoose";

export type PageContentType =
  | "privacy-policy"
  | "warranty-policy"
  | "shipping-return-policy"
  | "student-discount"
  | "shop-shape-tomorrow";

export interface IPageContent extends Document {
  type: PageContentType;
  content: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
