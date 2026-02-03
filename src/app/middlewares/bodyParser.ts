import { NextFunction, Request, Response } from "express";

export const parseBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  // Convert array fields from features[] to features
  const arrayFields = ["features", "colors", "removeImages", "categories", "subcategories"];
  arrayFields.forEach((field) => {
    const arrayKey = `${field}[]`;
    if (req.body[arrayKey]) {
      // If it's already an array, use it
      if (Array.isArray(req.body[arrayKey])) {
        req.body[field] = req.body[arrayKey];
      } else {
        // If it's a single value, wrap it in an array
        req.body[field] = [req.body[arrayKey]];
      }
      delete req.body[arrayKey];
    }
  });

  next();
};
