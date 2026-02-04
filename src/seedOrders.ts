import mongoose from "mongoose";
import config from "./app/config";
import { seedTestOrders } from "./app/utils/seedOrders";
import { Order, OrderItem } from "./app/modules/order/order.model";

async function runSeeding() {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(config.db_url as string);
    console.log("✅ Database connected successfully");

    // Ask user if they want to clear existing orders
    const shouldClear = process.argv.includes("--clear");
    
    if (shouldClear) {
      console.log("🗑️ Clearing existing orders...");
      await OrderItem.deleteMany({});
      await Order.deleteMany({});
      console.log("✅ Existing orders cleared");
    }

    // Seed orders
    await seedTestOrders();

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

runSeeding();
