import { Types } from "mongoose";

export interface TProductGroupMember {
  product: Types.ObjectId;
  label?: string; // short name shown on the storefront card, e.g. "Combo"
}

export interface TProductGroup {
  _id?: string;
  name: string; // admin-only name, e.g. "Bambu Lab A1 Series"
  title?: string; // storefront heading; frontend falls back to "Available Models"
  members: TProductGroupMember[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
