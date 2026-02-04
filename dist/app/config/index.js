"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    NODE_ENV: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    db_url: process.env.MONGODB_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "90d",
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    admin_firstname: process.env.ADMIN_FIRSTNAME || "Admin",
    admin_lastname: process.env.ADMIN_LASTNAME || "123",
    admin_phone: process.env.ADMIN_PHONE,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cors_origin: process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim())
        : ["http://localhost:3000", "http://localhost:3001"],
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
    // bKash Payment Gateway Configuration
    bkash_base_url: process.env.SANDBOX === "true"
        ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta"
        : "https://tokenized.pay.bka.sh/v1.2.0-beta",
    bkash_app_key: process.env.BKASH_APP_KEY,
    bkash_app_secret: process.env.BKASH_APP_SECRET,
    bkash_username: process.env.BKASH_USERNAME,
    bkash_password: process.env.BKASH_PASSWORD,
};
//# sourceMappingURL=index.js.map