import mongoose from "mongoose";
import { StaffPermission } from "../src/app/modules/permission/staff-permission.model";
import { Permission } from "../src/app/modules/permission/permission.model";
import { User } from "../src/app/modules/user/user.model";

const config = {
  database_url: process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/evo_tech",
};

async function testPermissionLookup() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to database");

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n📦 All collections in database:");
    collections.forEach(col => console.log("  -", col.name));

    // Find the user by ObjectId
    const userId = new mongoose.Types.ObjectId("68fe48c8be4df47204c5c7c6");
    console.log("\n🔍 Looking for user with ObjectId:", userId.toString());
    
    const user = await User.findById(userId);
    console.log("👤 User found:", user ? {
      _id: user._id,
      uuid: user.uuid,
      email: user.email,
      userType: user.userType
    } : "NOT FOUND");

    // Try to find staff permissions by ObjectId
    console.log("\n🔍 Looking for staff permissions with user ObjectId:", userId.toString());
    const staffPermissionByObjectId = await StaffPermission.findOne({ user: userId });
    console.log("📋 Staff permission by ObjectId:", staffPermissionByObjectId ? {
      _id: staffPermissionByObjectId._id,
      user: staffPermissionByObjectId.user,
      permissions: staffPermissionByObjectId.permissions,
      grantedBy: staffPermissionByObjectId.grantedBy
    } : "NOT FOUND");

    // Check all staff permissions in collection
    console.log("\n📋 All staff permissions in collection:");
    const allStaffPermissions = await StaffPermission.find({});
    allStaffPermissions.forEach(sp => {
      console.log("  -", {
        _id: sp._id,
        user: sp.user,
        userType: typeof sp.user,
        permissions: sp.permissions
      });
    });

    // Try direct MongoDB query
    console.log("\n🔍 Direct MongoDB query for staffpermissions collection:");
    const directQuery = await mongoose.connection.db.collection("staffpermissions").find({}).toArray();
    console.log("Found documents:", directQuery.length);
    directQuery.forEach(doc => {
      console.log("  -", {
        _id: doc._id,
        user: doc.user,
        userType: typeof doc.user,
        permissions: doc.permissions
      });
    });

    await mongoose.disconnect();
    console.log("\n✅ Test complete");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
  }
}

testPermissionLookup();
