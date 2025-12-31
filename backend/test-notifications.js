import 'dotenv/config';
import emailService from './services/emailService.js';
import telegramService from './services/telegramService.js';

async function testServices() {
    console.log('🚀 Starting Notification Services Test...');
    console.log('--------------------------------------------------');

    // Check env vars
    console.log('Checking Environment Variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Missing');
    console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
    console.log('--------------------------------------------------');

    // Test Telegram
    console.log('\n📱 Testing Telegram...');
    try {
        const telegramResult = await telegramService.testConnection();
        console.log('Telegram Result:', telegramResult);

        if (telegramResult.success) {
            const sendResult = await telegramService.sendContactNotification({
                name: 'Test Setup',
                email: 'test@example.com',
                message: 'This is a test message to verify Telegram integration.'
            });
            console.log('Telegram Send Result:', sendResult);
        }
    } catch (error) {
        console.error('❌ Telegram Test Failed:', error);
    }

    // Test Email
    console.log('\n📧 Testing Email (SendGrid)...');
    try {
        // First verify connection
        const connResult = await emailService.testConnection();
        console.log('SMTP Connection Result:', connResult);

        if (connResult.success) {
            const emailResult = await emailService.sendContactFormEmail({
                name: 'Test Setup',
                email: 'dilipan.portfolio@gmail.com', // Sending to self
                message: 'This is a test message to verify SendGrid integration.'
            });
            console.log('Email Send Result:', emailResult);
        }
    } catch (error) {
        console.error('❌ Email Test Failed:', error);
    }

    console.log('\n--------------------------------------------------');
    console.log('🏁 Test Complete');
    process.exit(0);
}

testServices();
