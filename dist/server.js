"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
exports.app = app_1.default;
const config_1 = __importDefault(require("./app/config"));
const seeding_1 = require("./app/utils/seeding");
let server;
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    if (server) {
        server.close(() => {
            console.error("Server closed due to unhandled rejection");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Connect to database on startup
let dbConnected = false;
async function connectDB() {
    if (dbConnected)
        return;
    try {
        await mongoose_1.default.connect(config_1.default.db_url);
        console.log("🛢 Database connected successfully");
        dbConnected = true;
        // Seed admin user if not exists
        await (0, seeding_1.seedAdmin)();
        // Seed test orders (comment out after first run if you don't want to add more)
        // await seedTestOrders();
    }
    catch (err) {
        console.error("Failed to connect to database:", err);
        throw err;
    }
}
// For traditional server deployment
async function bootstrap() {
    try {
        await connectDB();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Application is running on port ${config_1.default.port}`);
        });
        // Set server timeout to 5 minutes for long-running operations like image uploads
        // This prevents 502/503 errors on Hostinger when creating products with multiple images
        server.timeout = 300000; // 5 minutes (300 seconds)
        server.keepAliveTimeout = 305000; // Slightly higher than timeout
        server.headersTimeout = 310000; // Slightly higher than keepAliveTimeout
        console.log('⏱️  Server timeouts configured: 5 minutes');
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}
// Only run bootstrap if not in Vercel (serverless)
if (process.env.VERCEL !== '1') {
    bootstrap();
}
// For Vercel serverless deployment
// Export the Express app and ensure DB connection
exports.default = async (req, res) => {
    await connectDB();
    return (0, app_1.default)(req, res);
};
process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
        server.close(() => {
            console.log("Server closed due to SIGTERM");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received");
    if (server) {
        server.close(() => {
            console.log("Server closed due to SIGINT");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
//# sourceMappingURL=server.js.map