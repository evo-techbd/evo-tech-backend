"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const config_1 = __importDefault(require("../config"));
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = async () => {
    try {
        // Check if admin exists
        const admin = await user_model_1.User.findOne({
            userType: user_constant_1.USER_ROLE.ADMIN,
            email: config_1.default.admin_email,
        }).select('+password');
        if (admin) {
            console.log("🔄 Admin user exists, checking fields...");
            // Check if password exists and is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
            const needsPasswordUpdate = !admin.password || !admin.password.startsWith('$2');
            const needsNameUpdate = !admin.firstName || !admin.lastName;
            if (needsPasswordUpdate || needsNameUpdate) {
                console.log("🔧 Updating admin user...");
                const updateData = {};
                if (needsPasswordUpdate) {
                    // Hash the password properly
                    updateData.password = await bcryptjs_1.default.hash(config_1.default.admin_password, Number(config_1.default.bcrypt_salt_rounds));
                    console.log("   ✅ Password updated to hashed format");
                }
                if (needsNameUpdate) {
                    updateData.firstName = config_1.default.admin_firstname;
                    updateData.lastName = config_1.default.admin_lastname;
                    console.log("   ✅ Name fields updated");
                }
                await user_model_1.User.updateOne({ _id: admin._id }, updateData);
                console.log("✅ Admin user updated successfully");
            }
            else {
                console.log("✅ Admin user is properly configured");
            }
            return;
        }
        console.log("🌱 Seeding admin user...");
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(config_1.default.admin_password, Number(config_1.default.bcrypt_salt_rounds));
        await user_model_1.User.create({
            firstName: config_1.default.admin_firstname,
            lastName: config_1.default.admin_lastname,
            userType: user_constant_1.USER_ROLE.ADMIN,
            email: config_1.default.admin_email,
            password: hashedPassword,
            phone: config_1.default.admin_phone,
            isActive: true,
            newsletterOptIn: false,
            rewardPoints: 0,
        });
        console.log("✅ Admin user created successfully");
        console.log(`   Email: ${config_1.default.admin_email}`);
        console.log(`   Name: ${config_1.default.admin_firstname} ${config_1.default.admin_lastname}`);
        console.log("🌱 Seeding completed");
    }
    catch (error) {
        console.log("❌ Error in seeding admin user:", error);
    }
};
exports.seedAdmin = seedAdmin;
//# sourceMappingURL=seeding.js.map