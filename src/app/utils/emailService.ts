import nodemailer from 'nodemailer';
import { orderConfirmationTemplate } from './emailTemplates';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

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

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
        console.warn('⚠️ Email service not configured. EMAIL_USER and EMAIL_PASS environment variables are required.');
        return;
      }

      const config: EmailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      };

      this.transporter = nodemailer.createTransport(config);
      this.isConfigured = true;

      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️ Email service is not configured. Skipping email send.');
      return;
    }

    try {
      const htmlContent = orderConfirmationTemplate(orderData);

      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Evo-Tech Bangladesh',
          address: process.env.EMAIL_USER || '',
        },
        to: orderData.customerEmail,
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent:', info.messageId);
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      // Don't throw error - we don't want to fail the order if email fails
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
