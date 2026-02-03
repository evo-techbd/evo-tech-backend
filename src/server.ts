import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { seedAdmin } from "./app/utils/seeding";
import { seedTestOrders } from "./app/utils/seedOrders";

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

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");

    // Seed admin user if not exists
    await seedAdmin();
    
    // Seed test orders (comment out after first run if you don't want to add more)
    // await seedTestOrders();

    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });

    // Set server timeout to 5 minutes for long-running operations like image uploads
    // This prevents 502/503 errors on Hostinger when creating products with multiple images
    server.timeout = 300000; // 5 minutes (300 seconds)
    server.keepAliveTimeout = 305000; // Slightly higher than timeout
    server.headersTimeout = 310000; // Slightly higher than keepAliveTimeout
    
    console.log('⏱️  Server timeouts configured: 5 minutes');
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

bootstrap();

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
