import mongoose from 'mongoose';
import { StaffPermission } from '../../src/app/modules/permission/staff-permission.model';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function migratePermissionsToObjectId() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Get User model
        const User = require('../../src/app/modules/user/user.model').User;

        // Get all staff permissions (lean to get raw data)
        const allPermissions: any[] = await StaffPermission.find({}).lean();
        console.log(`Found ${allPermissions.length} staff permission records`);

        let migrated = 0;
        let failed = 0;

        for (const permission of allPermissions) {
            try {
                console.log(`\nProcessing permission:`, {
                    _id: permission._id,
                    user: permission.user,
                    userType: typeof permission.user
                });

                // Check if user field is already an ObjectId
                if (mongoose.Types.ObjectId.isValid(permission.user) && permission.user.toString().length === 24) {
                    console.log(`✓ Permission for user ${permission.user} already uses ObjectId`);
                    continue;
                }

                // Find user by UUID
                const user = await User.findOne({ uuid: permission.user }).select('_id');
                
                if (!user) {
                    console.log(`✗ User not found for UUID: ${permission.user}`);
                    failed++;
                    continue;
                }

                // Find admin by UUID if present
                let grantedById = permission.grantedBy;
                if (permission.grantedBy && !mongoose.Types.ObjectId.isValid(permission.grantedBy)) {
                    const admin = await User.findOne({ uuid: permission.grantedBy }).select('_id');
                    if (admin) {
                        grantedById = admin._id;
                    }
                }

                console.log(`Converting: UUID ${permission.user} -> ObjectId ${user._id}`);

                // Delete old record
                await StaffPermission.deleteOne({ _id: permission._id });

                // Create new record with ObjectId
                await StaffPermission.create({
                    user: user._id,
                    permissions: permission.permissions,
                    grantedBy: grantedById,
                });

                console.log(`✓ Migrated permissions for user ${permission.user} -> ${user._id}`);
                migrated++;
            } catch (error) {
                console.error(`✗ Error migrating permission:`, error);
                failed++;
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   Migrated: ${migrated}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Skipped (already ObjectId): ${allPermissions.length - migrated - failed}`);
        
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the migration
migratePermissionsToObjectId()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
