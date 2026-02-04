import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/app/config";
import { seedAdmin } from "../src/app/utils/seeding";

let dbConnected = false;

async function connectDB() {
  if (dbConnected) return;
  
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    dbConnected = true;

    // Seed admin user if not exists
    await seedAdmin();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}

// Vercel serverless function handler
export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
