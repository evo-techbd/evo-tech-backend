import dns from "dns";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { seedAdmin } from "./app/utils/seeding";

// MongoDB Atlas connection strings (mongodb+srv://) require DNS SRV record
// lookups. On some Windows machines/networks the default (router/ISP) DNS
// resolver doesn't support SRV queries and the lookup fails with
// "querySrv ECONNREFUSED". Pointing Node's resolver at public DNS servers
// that do support SRV records fixes this before any connection is attempted.
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

let server: Server;

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
  } else {
    process.exit(1);
  }
});

// Connect to database on startup
let dbConnected = false;
async function connectDB() {
  if (dbConnected) return;

  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    dbConnected = true;

    // Seed admin user if not exists
    await seedAdmin();

    // Seed test orders (comment out after first run if you don't want to add more)
    // await seedTestOrders();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}

// For traditional server deployment
async function bootstrap() {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });

    // Set server timeout to 5 minutes for long-running operations like image uploads
    // This prevents 502/503 errors on Hostinger when creating products with multiple images
    server.timeout = 300000; // 5 minutes (300 seconds)
    server.keepAliveTimeout = 305000; // Slightly higher than timeout
    server.headersTimeout = 310000; // Slightly higher than keepAliveTimeout

    console.log("⏱️  Server timeouts configured: 5 minutes");
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Only run bootstrap if not in Vercel (serverless)
if (process.env.VERCEL !== "1") {
  bootstrap();
}

// For Vercel serverless deployment
// Export the Express app and ensure DB connection
export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};

// Also export the app for direct import
export { app };

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close(() => {
      console.log("Server closed due to SIGTERM");
      process.exit(0);
    });
  } else {
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
  } else {
    process.exit(0);
  }
});
