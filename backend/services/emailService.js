import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialize();
    }

    initialize() {
        // Check if email is configured
        console.log('📧 initializing EmailService...');
        console.log('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
        console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);

        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
            console.warn('⚠️  Email service not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env');
            return;
        }

        // Create transporter
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            console.log('✅ Email service initialized with host:', process.env.EMAIL_HOST);
        } catch (err) {
            console.error('❌ Email service initialization failed:', err);
        }
    }

    async sendContactFormEmail(contactData) {
        if (!this.transporter) {
            console.log('📧 Email service not configured - skipping email send');
            return { success: false, message: 'Email service not configured' };
        }

        const { name, email, message } = contactData;

        try {
            // Send email to admin
            const adminMailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                subject: `New Contact Form Submission from ${name}`,
                html: this.getAdminEmailTemplate(name, email, message),
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            };

            await this.transporter.sendMail(adminMailOptions);

            // Send confirmation email to user
            const userMailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: 'Thank you for contacting me!',
                html: this.getUserConfirmationTemplate(name),
                text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you soon.\n\nBest regards`
            };

            await this.transporter.sendMail(userMailOptions);

            console.log(`✅ Contact form emails sent successfully to ${email}`);
            return { success: true, message: 'Emails sent successfully' };
        } catch (error) {
            console.error('❌ Email send error:', error);
            return { success: false, message: error.message };
        }
    }

    getAdminEmailTemplate(name, email, message) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .info-row { margin: 15px 0; }
                    .label { font-weight: bold; color: #6b7280; }
                    .message-box { background: white; padding: 20px; border-left: 4px solid #3b82f6; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🔔 New Contact Form Submission</h2>
                    </div>
                    <div class="content">
                        <div class="info-row">
                            <span class="label">From:</span> ${name}
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
                        </div>
                        <div class="message-box">
                            <p class="label">Message:</p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getUserConfirmationTemplate(name) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>✅ Message Received!</h2>
                    </div>
                    <div class="content">
                        <p>Hi ${name},</p>
                        <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
                        <p>I appreciate you taking the time to contact me.</p>
                        <p>Best regards,<br>Dilipan</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async testConnection() {
        if (!this.transporter) {
            return { success: false, message: 'Email service not configured' };
        }

        try {
            await this.transporter.verify();
            return { success: true, message: 'Email service is ready' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default new EmailService();
