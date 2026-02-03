// Load dotenv to read .env file
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "evo-tech-backend",
      script: "./dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "2G", // Increased from 1G for image processing
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
        PORT: process.env.PORT || 5000,
        // Cloudinary
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        // Database - using MONGODB_URI (not DATABASE_URL)
        MONGODB_URI: process.env.MONGODB_URI,
        // JWT
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
        // Other
        FRONTEND_URL: process.env.FRONTEND_URL,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        // Admin
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        ADMIN_FIRSTNAME: process.env.ADMIN_FIRSTNAME,
        ADMIN_LASTNAME: process.env.ADMIN_LASTNAME,
        ADMIN_PHONE: process.env.ADMIN_PHONE,
        // Email
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_SECURE: process.env.EMAIL_SECURE,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
        // BKash
        BKASH_BASE_URL: process.env.BKASH_BASE_URL,
        BKASH_APP_KEY: process.env.BKASH_APP_KEY,
        BKASH_APP_SECRET: process.env.BKASH_APP_SECRET,
        BKASH_USERNAME: process.env.BKASH_USERNAME,
        BKASH_PASSWORD: process.env.BKASH_PASSWORD,
      },
    },
  ],
};
