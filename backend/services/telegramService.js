import TelegramBot from 'node-telegram-bot-api';

class TelegramService {
    constructor() {
        this.bot = null;
        this.chatId = null;
        this.initialize();
    }

    initialize() {
        console.log('📱 initializing TelegramService...');
        console.log('   BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Missing');
        console.log('   CHAT_ID:', process.env.TELEGRAM_CHAT_ID);

        // Check if Telegram is configured
        if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
            console.warn('⚠️  Telegram service not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
            return;
        }

        try {
            // Create bot instance
            this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
            this.chatId = process.env.TELEGRAM_CHAT_ID;
            console.log('✅ Telegram service initialized');
        } catch (error) {
            console.error('❌ Telegram initialization error:', error.message);
        }
    }

    async sendContactNotification(contactData) {
        if (!this.bot || !this.chatId) {
            console.log('📱 Telegram service not configured - skipping notification');
            return { success: false, message: 'Telegram service not configured' };
        }

        const { name, email, message } = contactData;

        try {
            // Format message with emojis and formatting
            const telegramMessage = `
🔔 *New Contact Message*

👤 *From:* ${name}
📧 *Email:* ${email}

💬 *Message:*
${message.substring(0, 200)}${message.length > 200 ? '...' : ''}

⏰ *Received:* ${new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            })}
            `.trim();

            // Send message with Markdown formatting
            await this.bot.sendMessage(this.chatId, telegramMessage, {
                parse_mode: 'Markdown'
            });

            console.log(`✅ Telegram notification sent for contact from ${name}`);
            return { success: true, message: 'Telegram notification sent' };
        } catch (error) {
            console.error('❌ Telegram send error:', error);
            return { success: false, message: error.message };
        }
    }

    async testConnection() {
        if (!this.bot || !this.chatId) {
            return { success: false, message: 'Telegram service not configured' };
        }

        try {
            await this.bot.sendMessage(this.chatId, '✅ Telegram bot is working! You will receive contact form notifications here.');
            return { success: true, message: 'Test message sent successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default new TelegramService();
