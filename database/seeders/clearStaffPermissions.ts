import mongoose from 'mongoose';
import { StaffPermission } from '../../src/app/modules/permission/staff-permission.model';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function clearStaffPermissions() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);

        // Clear all staff permissions since old permission codes are invalid
        const deleteResult = await StaffPermission.deleteMany({});
    } catch (error) {
        console.error('❌ Error clearing staff permissions:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
}

// Run the script
clearStaffPermissions()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });
