interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingCode: string;
  orderDate: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    selectedColor?: string;
  }>;
  subtotal: number;
  deliveryCharge: number;
  totalPayable: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    subdistrict: string;
  };
  isPreOrderOrder: boolean;
  depositDue?: number;
  balanceDue?: number;
}

export const orderConfirmationTemplate = (data: OrderEmailData): string => {
  const formatCurrency = (amount: number) => `BDT ${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.productName}</strong>
        ${item.selectedColor ? `<br><span style="color: #6b7280; font-size: 14px;">Color: ${item.selectedColor}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>${formatCurrency(item.subtotal)}</strong></td>
    </tr>
  `).join('');

  const preOrderNotice = data.isPreOrderOrder ? `
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">📦 Pre-Order Information</h3>
      <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.6;">
        This order contains pre-order items. 
        ${data.depositDue ? `<br><strong>Deposit to pay now:</strong> ${formatCurrency(data.depositDue)}` : ''}
        ${data.balanceDue ? `<br><strong>Balance due on delivery:</strong> ${formatCurrency(data.balanceDue)}` : ''}
      </p>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed! 🎉</h1>
              <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Dear <strong>${data.customerName}</strong>,
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                We're excited to confirm your order! Your items are being prepared and will be on their way soon.
              </p>

              <!-- Order Summary Box -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">Order Number:</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <strong style="color: #111827; font-size: 16px;">${data.orderNumber}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">Tracking Code:</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <strong style="color: #111827; font-size: 16px;">${data.trackingCode}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">Order Date:</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #111827;">${data.orderDate}</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${preOrderNotice}

              <!-- Order Items -->
              <h2 style="color: #111827; font-size: 20px; margin: 32px 0 16px 0; font-weight: 600;">Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Product</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Pricing Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
                  <td style="padding: 8px 0; text-align: right; color: #111827;">${formatCurrency(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Delivery Charge:</td>
                  <td style="padding: 8px 0; text-align: right; color: #111827;">${formatCurrency(data.deliveryCharge)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 8px 0; color: #111827; font-size: 18px; font-weight: 700; border-top: 2px solid #e5e7eb;">Total:</td>
                  <td style="padding: 16px 0 8px 0; text-align: right; color: #667eea; font-size: 20px; font-weight: 700; border-top: 2px solid #e5e7eb;">${formatCurrency(data.totalPayable)}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h2 style="color: #111827; font-size: 20px; margin: 32px 0 16px 0; font-weight: 600;">Shipping Address</h2>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; line-height: 1.8;">
                <p style="margin: 0; color: #111827;"><strong>${data.shippingAddress.fullName}</strong></p>
                <p style="margin: 8px 0 0 0; color: #6b7280;">${data.shippingAddress.phone}</p>
                <p style="margin: 8px 0 0 0; color: #6b7280;">${data.shippingAddress.address}</p>
                <p style="margin: 8px 0 0 0; color: #6b7280;">${data.shippingAddress.subdistrict}, ${data.shippingAddress.city}</p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h3 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">📋 What's Next?</h3>
                <ul style="color: #1e3a8a; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li>We'll process your order within 24-48 hours</li>
                  <li>You'll receive a shipping notification once your order is dispatched</li>
                  <li>Track your order using the tracking code above</li>
                  <li>Expected delivery: 3-7 business days</li>
                </ul>
              </div>

              <!-- Support -->
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                Need help? Contact us at <a href="mailto:support@evotech.com.bd" style="color: #667eea; text-decoration: none;">support@evotech.com.bd</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                <strong>Evo-Tech Bangladesh</strong>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Your trusted partner for technology and innovation
              </p>
              <div style="margin-top: 16px;">
                <a href="#" style="color: #667eea; text-decoration: none; margin: 0 8px; font-size: 12px;">Website</a>
                <span style="color: #d1d5db;">|</span>
                <a href="#" style="color: #667eea; text-decoration: none; margin: 0 8px; font-size: 12px;">Facebook</a>
                <span style="color: #d1d5db;">|</span>
                <a href="#" style="color: #667eea; text-decoration: none; margin: 0 8px; font-size: 12px;">Support</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
