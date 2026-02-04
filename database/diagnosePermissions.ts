import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../src/app/modules/user/user.model";
import { StaffPermission } from "../src/app/modules/permission/staff-permission.model";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  database_url: process.env.MONGODB_URI,
};

async function diagnosePermissionIssue() {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await mongoose.connect(config.database_url as string);
    console.log("✅ Connected to database\n");

    // Get the staff permission document
    console.log("📋 Raw staff permission document:");
    const rawPermission = await mongoose.connection.db
      .collection("staffpermissions")
      .findOne({});
    console.log(JSON.stringify(rawPermission, null, 2));
    
    console.log("\n🔍 User field type:", typeof rawPermission?.user);
    console.log("🔍 User field value:", rawPermission?.user);

    // Try to find user by this ID
    const userId = rawPermission?.user;
    if (userId) {
      // Try as ObjectId
      if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
        console.log("\n🔍 Trying to find user with ObjectId:", userId);
        const userByObjectId = await User.findById(userId);
        console.log("Result:", userByObjectId ? {
          _id: userByObjectId._id,
          uuid: userByObjectId.uuid,
          email: userByObjectId.email,
          userType: userByObjectId.userType,
          firstName: userByObjectId.firstName,
          lastName: userByObjectId.lastName
        } : "NOT FOUND");
      } else {
        console.log("\n⚠️ User field is already an ObjectId");
        const userByObjectId = await User.findById(userId);
        console.log("Result:", userByObjectId ? {
          _id: userByObjectId._id,
          uuid: userByObjectId.uuid,
          email: userByObjectId.email,
          userType: userByObjectId.userType,
          firstName: userByObjectId.firstName,
          lastName: userByObjectId.lastName
        } : "NOT FOUND");
      }
    }

    // List all EMPLOYEE users
    console.log("\n\n👥 All EMPLOYEE users in database:");
    const employees = await User.find({ userType: 'employee' });
    employees.forEach(emp => {
      console.log("  -", {
        _id: emp._id.toString(),
        uuid: emp.uuid,
        email: emp.email,
        firstName: emp.firstName,
        lastName: emp.lastName
      });
    });

    // Check if this is an ObjectId or string in MongoDB
    console.log("\n\n🧪 Testing StaffPermission model query:");
    const testQuery = await StaffPermission.findOne({});
    console.log("StaffPermission.findOne() result:", testQuery ? {
      _id: testQuery._id,
      user: testQuery.user,
      userType: typeof testQuery.user,
      permissions: testQuery.permissions
    } : "NOT FOUND");

    await mongoose.disconnect();
    console.log("\n✅ Diagnosis complete");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
  }
}

diagnosePermissionIssue();
