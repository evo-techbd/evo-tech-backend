import multer from "multer";
import path from "path";

// Use memory storage - we'll upload to Cloudinary manually in controllers
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: any, file: any, cb: any) => {
  console.log("🔍 [MULTER] File filter called for:", file.originalname);
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log("✅ [MULTER] File accepted:", file.originalname);
    return cb(null, true);
  } else {
    console.log("❌ [MULTER] File rejected:", file.originalname);
    cb(new Error("Only image files are allowed!"));
  }
};

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 11, // Max 11 files (1 main + 10 additional)
  },
  fileFilter: fileFilter,
});
