export interface TCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string; // Category background image for cards
  isActive: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
