"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
// Trust proxy - Required for Hostinger/Apache reverse proxy
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', true);
// CORS configuration - Allow multiple origins
const allowedOrigins = Array.isArray(config_1.default.cors_origin)
    ? config_1.default.cors_origin
    : [config_1.default.cors_origin];
// Log allowed origins for debugging
console.log("Allowed CORS Origins:", allowedOrigins);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin)
            return callback(null, true);
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some((allowed) => {
            if (allowed === "*")
                return true;
            if (allowed === origin)
                return true;
            // Handle wildcards like *.vercel.app
            if (allowed.includes("*")) {
                const pattern = allowed.replace(/\*/g, ".*");
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
    ],
    exposedHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86400, // 24 hours
}));
// Handle preflight requests explicitly
app.options("*", (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Request timeout middleware - prevent indefinite hanging requests
// Skip timeout for specific routes that need more time (e.g., product creation with images)
app.use((req, res, next) => {
    // Set 4-minute timeout for image upload routes, 30s for others
    const isImageUpload = req.path.includes('/products') && ['POST', 'PUT'].includes(req.method);
    const timeoutMs = isImageUpload ? 240000 : 30000; // 4 minutes : 30 seconds
    req.setTimeout(timeoutMs, () => {
        console.error(`[TIMEOUT] Request timed out after ${timeoutMs}ms: ${req.method} ${req.path}`);
        if (!res.headersSent) {
            res.status(http_status_1.default.REQUEST_TIMEOUT).json({
                success: false,
                message: 'Request timeout - operation took too long',
            });
        }
    });
    next();
});
// Request logging middleware - log all incoming requests
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[REQUEST] ${req.method} ${req.path} - Content-Type: ${req.headers['content-type'] || 'none'}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[RESPONSE] ${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`);
    });
    next();
});
// Parser with size limits to handle large payloads (e.g., product images)
// Skip parsing for multipart/form-data - let multer handle it
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        console.log('⏭️  Skipping body parser for multipart/form-data');
        return next();
    }
    next();
});
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// API routes
app.use("/api/v1", routes_1.default);
app.use("/api", routes_1.default); // Additional mount point for legacy/shorthand requests
// Health check route for monitoring
app.get("/health", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.default.NODE_ENV,
    });
});
// Testing route
app.get("/", (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Welcome to the Evo-Tech E-commerce API",
        timestamp: new Date().toISOString(),
    });
});
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle not found
app.use(notFound_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map