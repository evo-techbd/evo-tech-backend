import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  database_url: process.env.MONGODB_URI,
};

async function listAllCollections() {
  try {
    console.log("🔗 Connecting to:", config.database_url?.substring(0, 50) + "...");
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to database");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n📦 All collections in database:");
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  - ${col.name} (${count} documents)`);
      
      // Show sample document for specific collections
      if (count > 0 && (col.name.includes('permission') || col.name.includes('user'))) {
        const sample = await mongoose.connection.db.collection(col.name).findOne();
        console.log(`    Sample:`, JSON.stringify(sample, null, 2));
      }
    }

    await mongoose.disconnect();
    console.log("\n✅ Done");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
  }
}

listAllCollections();
