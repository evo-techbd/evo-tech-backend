import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// See src/server.ts — some Windows networks can't resolve the SRV record
// mongodb+srv:// needs, so point Node at public DNS servers that can.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// 3D printing sales share the orders' monthly invoice serial counter
// (MM + 3-digit sequence, e.g. "09001"), so both kinds of invoice come off
// one numbering and never print the same SL. Unlike the order backfill, this
// only fills sales that don't have a serial yet, taking the next number from
// the counter of the month each sale was created in — existing order serials
// (which may already be printed and handed out) are never renumbered.
// Safe to re-run: sales that already have a serial are skipped.
async function backfillPrintingSaleInvoiceSerial() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const { PrintingSale } = require('../../src/app/modules/printing-sale/printing-sale.model');
        const { getNextInvoiceSerial } = require('../../src/app/utils/counter');

        const sales: { _id: mongoose.Types.ObjectId; createdAt: Date }[] =
            await PrintingSale.find({
                $or: [{ invoiceSerial: { $exists: false } }, { invoiceSerial: null }, { invoiceSerial: '' }],
            })
                .sort({ createdAt: 1 })
                .select('_id createdAt')
                .lean();

        console.log(`Found ${sales.length} printing sales without an invoice serial`);

        let migrated = 0;
        for (const sale of sales) {
            const invoiceSerial = await getNextInvoiceSerial(new Date(sale.createdAt));
            await PrintingSale.updateOne(
                { _id: sale._id },
                { $set: { invoiceSerial } },
            );
            migrated += 1;
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   Assigned invoiceSerial to: ${migrated} printing sales`);
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

backfillPrintingSaleInvoiceSerial()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
