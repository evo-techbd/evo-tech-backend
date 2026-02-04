"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("./emailTemplates");
class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.initialize();
    }
    initialize() {
        try {
            const emailUser = process.env.EMAIL_USER;
            const emailPass = process.env.EMAIL_PASS;
            if (!emailUser || !emailPass) {
                console.warn('⚠️ Email service not configured. EMAIL_USER and EMAIL_PASS environment variables are required.');
                return;
            }
            const config = {
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            };
            this.transporter = nodemailer_1.default.createTransport(config);
            this.isConfigured = true;
            console.log('✅ Email service initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            this.isConfigured = false;
        }
    }
    async sendOrderConfirmation(orderData) {
        if (!this.isConfigured || !this.transporter) {
            console.warn('⚠️ Email service is not configured. Skipping email send.');
            return;
        }
        try {
            const htmlContent = (0, emailTemplates_1.orderConfirmationTemplate)(orderData);
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
        }
        catch (error) {
            console.error('❌ Failed to send order confirmation email:', error);
            // Don't throw error - we don't want to fail the order if email fails
        }
    }
    async verifyConnection() {
        if (!this.isConfigured || !this.transporter) {
            return false;
        }
        try {
            await this.transporter.verify();
            console.log('✅ Email service connection verified');
            return true;
        }
        catch (error) {
            console.error('❌ Email service connection failed:', error);
            return false;
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map