"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Use memory storage - we'll upload to Cloudinary manually in controllers
const storage = multer_1.default.memoryStorage();
// File filter to accept only images
const fileFilter = (req, file, cb) => {
    console.log("🔍 [MULTER] File filter called for:", file.originalname);
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        console.log("✅ [MULTER] File accepted:", file.originalname);
        return cb(null, true);
    }
    else {
        console.log("❌ [MULTER] File rejected:", file.originalname);
        cb(new Error("Only image files are allowed!"));
    }
};
exports.multerUpload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit per file (after compression)
        files: 11, // Max 11 files (1 main + 10 additional)
        fieldSize: 2 * 1024 * 1024, // 2MB field size
    },
    fileFilter: fileFilter,
});
//# sourceMappingURL=multer.config.js.map