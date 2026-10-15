import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// See src/server.ts — some Windows networks can't resolve the SRV record
// mongodb+srv:// needs, so point Node at public DNS servers that can.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Invoice serials used to be MM + a 3-digit sequence (e.g. "10003") and are
// now YY + MM + a 3-digit sequence (e.g. "2610003"). This prefixes the
// two-digit year (taken from each record's createdAt) onto every old-style
// serial on orders and 3D printing sales, keeping the running number as-is,
// so already-printed numbers stay recognisable. The monthly counters are
// keyed by year+month and need no change.
// Safe to re-run: serials already in the new 7-digit format are skipped.
const OLD_SERIAL = /^\d{5}$/;

async function convertCollection(
    label: string,
    Model: mongoose.Model<any>,
): Promise<number> {
    const docs: { _id: mongoose.Types.ObjectId; createdAt: Date; invoiceSerial: string }[] =
        await Model.find({ invoiceSerial: { $regex: OLD_SERIAL } })
            .select('_id createdAt invoiceSerial')
            .lean();

    console.log(`Found ${docs.length} ${label} with old-style serials`);

    for (const doc of docs) {
        const year = String(new Date(doc.createdAt).getFullYear() % 100).padStart(2, '0');
        const invoiceSerial = `${year}${doc.invoiceSerial}`;
        await Model.updateOne(
            { _id: doc._id, invoiceSerial: doc.invoiceSerial },
            { $set: { invoiceSerial } },
        );
    }

    return docs.length;
}

async function convertInvoiceSerialToYearMonth() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const { Order } = require('../../src/app/modules/order/order.model');
        const { PrintingSale } = require('../../src/app/modules/printing-sale/printing-sale.model');

        const orders = await convertCollection('orders', Order);
        const sales = await convertCollection('printing sales', PrintingSale);

        console.log(`\n✅ Migration complete!`);
        console.log(`   Converted: ${orders} orders, ${sales} printing sales`);
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

convertInvoiceSerialToYearMonth()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
