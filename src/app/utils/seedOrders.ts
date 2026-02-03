import { Order, OrderItem } from "../modules/order/order.model";
import { User } from "../modules/user/user.model";
import { Product } from "../modules/product/product.model";

export const seedTestOrders = async () => {
  try {
    console.log("🌱 Seeding test orders...");

    // Get a test user (or create one)
    let testUser = await User.findOne({ email: { $ne: null } });
    
    if (!testUser) {
      console.log("⚠️ No users found. Please create users first.");
      return;
    }

    // Get some products
    const products = await Product.find({ published: true }).limit(10);
    
    if (products.length === 0) {
      console.log("⚠️ No products found. Please seed products first.");
      return;
    }

    // Clear existing orders (optional - remove this if you want to keep existing data)
    // await Order.deleteMany({});
    // await OrderItem.deleteMany({});
    // console.log("🗑️ Cleared existing orders");

    const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const paymentStatuses = ["pending", "paid", "failed", "refunded"];
    const paymentMethods = ["cash_on_delivery", "bkash", "nagad", "credit_card", "bank_transfer"];
    const shippingTypes = ["home_delivery", "pickup_point", "express_delivery"];
    
    const cities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];
    const firstNames = ["Ahmed", "Fatima", "Rahim", "Ayesha", "Karim", "Nadia", "Shakil", "Sadia"];
    const lastNames = ["Khan", "Rahman", "Ahmed", "Hossain", "Islam", "Begum", "Chowdhury", "Ali"];

    // Create 20 test orders
    for (let i = 0; i < 20; i++) {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      // Select random products for this order
      const orderProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 products per order
      
      const subtotal = orderProducts.reduce((sum, product) => {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        return sum + (product.price * quantity);
      }, 0);
      
      const deliveryCharge = Math.floor(Math.random() * 100) + 50; // 50-150
      const discount = Math.floor(Math.random() * subtotal * 0.1); // 0-10% discount
      const totalPayable = subtotal + deliveryCharge - discount;
      
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = orderStatus === "delivered" 
        ? "paid" 
        : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      // Create order
      const order = await Order.create({
        user: testUser._id.toString(),
        firstname: randomFirstName,
        lastname: randomLastName,
        phone: `01${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com`,
        houseStreet: `${Math.floor(Math.random() * 500) + 1}, Street ${Math.floor(Math.random() * 50) + 1}`,
        city: randomCity,
        subdistrict: `${randomCity} District`,
        postcode: `${Math.floor(Math.random() * 9000) + 1000}`,
        country: "Bangladesh",
        shippingType: shippingTypes[Math.floor(Math.random() * shippingTypes.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        transactionId: paymentStatus === "paid" ? `TXN-${Date.now()}-${i}` : undefined,
        terms: true,
        subtotal,
        discount,
        deliveryCharge,
        additionalCharge: 0,
        totalPayable,
        orderStatus: orderStatus as any,
        paymentStatus: paymentStatus as any,
        viewed: Math.random() > 0.5,
        unpaidNotified: paymentStatus === "pending" ? Math.random() > 0.7 : false,
        deliveredAt: orderStatus === "delivered" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        notes: Math.random() > 0.7 ? "Special delivery instructions" : undefined,
        trackingCode: ["shipped", "delivered"].includes(orderStatus) ? `TRACK-${Date.now()}-${i}` : undefined,
      });

      // Create order items
      for (const product of orderProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        await OrderItem.create({
          order: order._id,
          product: product._id,
          productName: product.name,
          productPrice: product.price,
          quantity,
          selectedColor: product.colors?.[0] || undefined,
          subtotal: product.price * quantity,
        });
      }

      console.log(`   ✅ Created order ${i + 1}/20: ${order.orderNumber} - ${orderStatus}`);
    }

    console.log("✅ Successfully seeded 20 test orders");
  } catch (error) {
    console.error("❌ Error seeding test orders:", error);
  }
};
