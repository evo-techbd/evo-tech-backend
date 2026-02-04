import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { PermissionServices } from "../src/app/modules/permission/permission.service";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  database_url: process.env.MONGODB_URI,
};

async function testPermissionAPI() {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to database\n");

    const userUuid = "c1e212f7-f2c6-47ac-8ad8-0068ecb88ca3";
    const userObjectId = "68fe48c8be4df47204c5c7c6";

    console.log("🧪 Testing getPermittedRoutesForUser with UUID:");
    console.log("   Input:", userUuid);
    const routesByUuid = await PermissionServices.getPermittedRoutesForUser(userUuid);
    console.log("   Result:", routesByUuid);

    console.log("\n🧪 Testing getPermittedRoutesForUser with ObjectId:");
    console.log("   Input:", userObjectId);
    const routesByObjectId = await PermissionServices.getPermittedRoutesForUser(userObjectId);
    console.log("   Result:", routesByObjectId);

    console.log("\n🧪 Testing getStaffPermissionsFromDB with UUID:");
    console.log("   Input:", userUuid);
    const permissionsByUuid = await PermissionServices.getStaffPermissionsFromDB(userUuid);
    console.log("   Result:", JSON.stringify(permissionsByUuid, null, 2));

    await mongoose.disconnect();
    console.log("\n✅ Test complete");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
  }
}

testPermissionAPI();
