import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// See src/server.ts — some Windows networks can't resolve the SRV record
// mongodb+srv:// needs, so point Node at public DNS servers that can.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Orders marked "paid" from the admin status dropdown only had their status
// changed — amountPaid stayed at whatever it was (often 0), so those orders
// showed money still due and were missing from cash collected. A "paid"
// order is settled in full, so this sets amountPaid = totalPayable and
// amountDue = 0 (and the Group Buy deposit/balance fields to paid).
// Only touches orders already marked "paid" with amountPaid below
// totalPayable. Safe to re-run. Pass --dry-run to only list the changes.
async function backfillPaidOrderAmounts() {
    const dryRun = process.argv.includes('--dry-run');
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const { Order } = require('../../src/app/modules/order/order.model');

        const orders = await Order.find({
            paymentStatus: 'paid',
            $expr: { $lt: [{ $ifNull: ['$amountPaid', 0] }, '$totalPayable'] },
        })
            .select('_id orderNumber totalPayable amountPaid isPreOrderOrder depositDue balanceDue')
            .lean();

        const shortfall = orders.reduce(
            (sum: number, o: any) => sum + (o.totalPayable - (o.amountPaid || 0)),
            0,
        );
        console.log(
            `${orders.length} paid order(s) with amountPaid below totalPayable (BDT ${shortfall} unrecorded)`,
        );

        for (const order of orders as any[]) {
            console.log(
                `  ${order.orderNumber}: amountPaid ${order.amountPaid || 0} -> ${order.totalPayable}`,
            );
            if (dryRun) continue;

            const update: Record<string, unknown> = {
                amountPaid: order.totalPayable,
                amountDue: 0,
            };
            if (order.isPreOrderOrder) {
                update.depositPaid = order.depositDue || 0;
                update.balancePaid = order.balanceDue || 0;
                update.depositStatus = 'paid';
                update.balanceStatus = 'paid';
            }
            await Order.updateOne({ _id: order._id }, { $set: update });
        }

        console.log(dryRun ? 'Dry run — nothing changed' : 'Backfill complete');
    } catch (error) {
        console.error('Backfill failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

backfillPaidOrderAmounts();
