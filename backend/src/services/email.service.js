/**
 * Email Service using SendGrid
 * Handles sending emails for contact form submissions
 */

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send contact form notification email
 * @param {Object} contactData - Contact form data
 * @returns {Promise} SendGrid response
 */
export const sendContactNotification = async (contactData) => {
    try {
        // Check if SendGrid is configured
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('⚠️  SendGrid not configured - Email not sent');
            return { success: false, message: 'Email service not configured' };
        }

        const { name, email, subject, message } = contactData;

        // Email to admin
        const adminEmail = {
            to: process.env.SENDGRID_TO_EMAIL || process.env.SENDGRID_FROM_EMAIL,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: `Portfolio Contact: ${subject}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>Sent from your portfolio contact form</p>
                <p>Received at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Received at: ${new Date().toLocaleString()}
      `
        };

        // Send email
        await sgMail.send(adminEmail);

        console.log(`✅ Contact form email sent to ${adminEmail.to}`);
        return { success: true, message: 'Email sent successfully' };

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        return { success: false, message: 'Failed to send email', error: error.message };
    }
};

/**
 * Send auto-reply to contact form submitter
 * @param {Object} contactData - Contact form data
 * @returns {Promise} SendGrid response
 */
export const sendAutoReply = async (contactData) => {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            return { success: false, message: 'Email service not configured' };
        }

        const { name, email } = contactData;

        const autoReply = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Thank you for contacting me!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">✨ Thank You for Reaching Out!</h2>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for contacting me through my portfolio! I've received your message and will get back to you as soon as possible.</p>
              <p>I typically respond within 24-48 hours.</p>
              <p>Best regards,<br>Dilipan</p>
              <div class="footer">
                <p>This is an automated response. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
Hi ${name},

Thank you for contacting me through my portfolio! I've received your message and will get back to you as soon as possible.

I typically respond within 24-48 hours.

Best regards,
Dilipan

---
This is an automated response. Please do not reply to this email.
      `
        };

        await sgMail.send(autoReply);
        console.log(`✅ Auto-reply sent to ${email}`);
        return { success: true, message: 'Auto-reply sent successfully' };

    } catch (error) {
        console.error('❌ Error sending auto-reply:', error.message);
        return { success: false, message: 'Failed to send auto-reply', error: error.message };
    }
};

export default { sendContactNotification, sendAutoReply };
