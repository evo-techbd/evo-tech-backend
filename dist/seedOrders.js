"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const seedOrders_1 = require("./app/utils/seedOrders");
const order_model_1 = require("./app/modules/order/order.model");
async function runSeeding() {
    try {
        console.log("🔌 Connecting to database...");
        await mongoose_1.default.connect(config_1.default.db_url);
        console.log("✅ Database connected successfully");
        // Ask user if they want to clear existing orders
        const shouldClear = process.argv.includes("--clear");
        if (shouldClear) {
            console.log("🗑️ Clearing existing orders...");
            await order_model_1.OrderItem.deleteMany({});
            await order_model_1.Order.deleteMany({});
            console.log("✅ Existing orders cleared");
        }
        // Seed orders
        await (0, seedOrders_1.seedTestOrders)();
        console.log("✅ Seeding completed successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
}
runSeeding();
//# sourceMappingURL=seedOrders.js.map