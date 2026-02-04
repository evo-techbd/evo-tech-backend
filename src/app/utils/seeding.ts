import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    // Check if admin exists
    const admin = await User.findOne({
      userType: USER_ROLE.ADMIN,
      email: config.admin_email,
    }).select('+password');

    if (admin) {
      console.log("🔄 Admin user exists, checking fields...");
      
      // Check if password exists and is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      const needsPasswordUpdate = !admin.password || !admin.password.startsWith('$2');
      const needsNameUpdate = !admin.firstName || !admin.lastName;
      
      if (needsPasswordUpdate || needsNameUpdate) {
        console.log("🔧 Updating admin user...");
        
        const updateData: any = {};
        
        if (needsPasswordUpdate) {
          // Hash the password properly
          updateData.password = await bcryptjs.hash(
            config.admin_password as string,
            Number(config.bcrypt_salt_rounds)
          );
          console.log("   ✅ Password updated to hashed format");
        }
        
        if (needsNameUpdate) {
          updateData.firstName = config.admin_firstname;
          updateData.lastName = config.admin_lastname;
          console.log("   ✅ Name fields updated");
        }
        
        await User.updateOne(
          { _id: admin._id },
          updateData
        );
        
        console.log("✅ Admin user updated successfully");
      } else {
        console.log("✅ Admin user is properly configured");
      }
      return;
    }

    console.log("🌱 Seeding admin user...");

    // Hash the password
    const hashedPassword = await bcryptjs.hash(
      config.admin_password as string,
      Number(config.bcrypt_salt_rounds)
    );

    await User.create({
      firstName: config.admin_firstname,
      lastName: config.admin_lastname,
      userType: USER_ROLE.ADMIN,
      email: config.admin_email,
      password: hashedPassword,
      phone: config.admin_phone,
      isActive: true,
      newsletterOptIn: false,
      rewardPoints: 0,
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${config.admin_email}`);
    console.log(`   Name: ${config.admin_firstname} ${config.admin_lastname}`);
    console.log("🌱 Seeding completed");
  } catch (error) {
    console.log("❌ Error in seeding admin user:", error);
  }
};