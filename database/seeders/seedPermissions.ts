import mongoose from 'mongoose';
import { Permission } from '../../src/app/modules/permission/permission.model';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define all permissions based on the frontend sidebar menu structure
const permissions = [
    // Dashboard Permissions
    {
        code: 'VIEW_DASHBOARD',
        name: 'Dashboard',
        route: '/control',
        category: 'Dashboard',
        description: 'Access to view the admin dashboard and analytics overview',
    },

    // Product Management Permissions
    {
        code: 'MANAGE_PRODUCTS',
        name: 'Products',
        route: '/control/products',
        category: 'Products',
        description: 'Access to view and manage all products in the system',
    },
    {
        code: 'MANAGE_CATEGORIES',
        name: 'Categories',
        route: '/control/categories',
        category: 'Products',
        description: 'Access to view and manage product categories and subcategories',
    },
    {
        code: 'MANAGE_BRANDS',
        name: 'Brands',
        route: '/control/brands',
        category: 'Products',
        description: 'Access to view and manage product brands',
    },

    // Order Management Permissions
    {
        code: 'MANAGE_ORDERS',
        name: 'Orders',
        route: '/control/orders',
        category: 'Sales',
        description: 'Access to view and manage customer orders',
    },

    // Customer Management Permissions
    {
        code: 'MANAGE_CUSTOMERS',
        name: 'Customers',
        route: '/control/customers',
        category: 'Customers',
        description: 'Access to view and manage customer accounts',
    },

    // Report Permissions
    {
        code: 'VIEW_EARNINGS_REPORT',
        name: 'Earnings Report',
        route: '/control/reports/earnings',
        category: 'Reports',
        description: 'Access to view detailed earnings and financial reports',
    },
    {
        code: 'VIEW_SALES_REPORT',
        name: 'Sales Report',
        route: '/control/reports/sales',
        category: 'Reports',
        description: 'Access to view sales analytics and trends',
    },

    // Staff Management Permissions
    {
        code: 'MANAGE_STAFF',
        name: 'Staff Management',
        route: '/control/staff',
        category: 'Staff Management',
        description: 'Access to view and manage staff members',
    },
    {
        code: 'MANAGE_PERMISSIONS',
        name: 'Permissions',
        route: '/control/permissions',
        category: 'Staff Management',
        description: 'Access to assign and manage staff permissions',
    },

    // Settings Permissions
    {
        code: 'MANAGE_SITE_SETTINGS',
        name: 'Site Settings',
        route: '/control/settings',
        category: 'Settings',
        description: 'Access to modify site settings and configurations',
    },
    {
        code: 'MANAGE_HOMEPAGE',
        name: 'Homepage Settings',
        route: '/control/settings/homepage',
        category: 'Settings',
        description: 'Access to configure homepage layout and content',
    },
    {
        code: 'MANAGE_FEATURES',
        name: 'Features',
        route: '/control/settings/features',
        category: 'Settings',
        description: 'Access to enable/disable system features',
    },
    {
        code: 'MANAGE_SHIPPING',
        name: 'Shipping Settings',
        route: '/control/settings/shipping',
        category: 'Settings',
        description: 'Access to configure shipping methods and pickup points',
    },
    {
        code: 'MANAGE_TAX',
        name: 'Tax Settings',
        route: '/control/settings/tax',
        category: 'Settings',
        description: 'Access to configure VAT and tax settings',
    },
    {
        code: 'MANAGE_CURRENCY',
        name: 'Currency Settings',
        route: '/control/settings/currency',
        category: 'Settings',
        description: 'Access to configure currency settings',
    },
    {
        code: 'MANAGE_INTEGRATIONS',
        name: 'Integrations',
        route: '/control/settings/integrations',
        category: 'Settings',
        description: 'Access to configure third-party integrations',
    },

    // Review & Rating Permissions
    {
        code: 'MODERATE_REVIEWS',
        name: 'Reviews',
        route: '/control/reviews',
        category: 'Reviews',
        description: 'Access to view and moderate product reviews',
    },

    // Inventory Permissions
    {
        code: 'MANAGE_INVENTORY',
        name: 'Inventory',
        route: '/control/inventory',
        category: 'Inventory',
        description: 'Access to view and manage inventory levels',
    },
];

async function seedPermissions() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing permissions
        const deleteResult = await Permission.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing permissions`);

        // Insert new permissions
        const insertResult = await Permission.insertMany(permissions);
        console.log(`✅ Successfully seeded ${insertResult.length} permissions`);

        // Display grouped permissions
        const categories = [...new Set(permissions.map(p => p.category))];
        console.log('\n📋 Permissions by Category:');
        categories.forEach(category => {
            const categoryPerms = permissions.filter(p => p.category === category);
            console.log(`\n${category} (${categoryPerms.length}):`);
            categoryPerms.forEach(p => {
                console.log(`  - ${p.code}: ${p.name}`);
            });
        });

        console.log(`\n✅ Total permissions seeded: ${permissions.length}`);
        
    } catch (error) {
        console.error('❌ Error seeding permissions:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the seeder
seedPermissions()
    .then(() => {
        console.log('✅ Permission seeding completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Permission seeding failed:', error);
        process.exit(1);
    });
