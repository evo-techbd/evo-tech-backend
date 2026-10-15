import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// See src/server.ts — some Windows networks can't resolve the SRV record
// mongodb+srv:// needs, so point Node at public DNS servers that can.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Invoice serials are shop-style: YY + MM + a 3-digit sequence that resets
// every calendar month (e.g. "2609001", "2609002", ... then "2610001").
// This (re)assigns every order's invoiceSerial from scratch, grouping by the
// calendar month of its createdAt and numbering 1, 2, 3... within each month
// in chronological order — safe to re-run any time (fully deterministic).
async function backfillInvoiceSerial() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const { Order } = require('../../src/app/modules/order/order.model');
        const { ensureInvoiceSerialAtLeast, formatInvoiceSerial } = require('../../src/app/utils/counter');

        const orders: { _id: mongoose.Types.ObjectId; createdAt: Date }[] =
            await Order.find({})
                .sort({ createdAt: 1 })
                .select('_id createdAt')
                .lean();

        console.log(`Found ${orders.length} orders total`);

        const monthKey = (date: Date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const countInMonth = new Map<string, number>();
        let migrated = 0;

        for (const order of orders) {
            const createdAt = new Date(order.createdAt);
            const key = monthKey(createdAt);
            const nextInMonth = (countInMonth.get(key) || 0) + 1;
            countInMonth.set(key, nextInMonth);

            const invoiceSerial = formatInvoiceSerial(createdAt, nextInMonth);

            await Order.updateOne(
                { _id: order._id },
                { $set: { invoiceSerial } },
            );
            migrated += 1;
        }

        // Make sure each month's counter continues from where the backfill
        // left off, so the next new order placed in an already-seen month
        // doesn't collide with a backfilled number.
        for (const [key, count] of countInMonth.entries()) {
            const [year, month] = key.split('-').map(Number);
            await ensureInvoiceSerialAtLeast(new Date(year, month - 1, 1), count);
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   Assigned invoiceSerial to: ${migrated} orders`);
        console.log(`   Months seen: ${[...countInMonth.entries()].map(([k, c]) => `${k} (${c})`).join(', ')}`);
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

backfillInvoiceSerial()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
