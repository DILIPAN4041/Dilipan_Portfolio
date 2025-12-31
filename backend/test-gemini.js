import { GoogleGenerativeAI } from '@google/generative-ai';

// Test Gemini API connection
async function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ No API key found in environment');
        return;
    }

    console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
    console.log('📡 Testing Gemini API connection...\n');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        console.log('⏳ Sending test request...');
        const result = await model.generateContent('Say "Hello, API is working!"');
        const response = await result.response;
        const text = response.text();

        console.log('\n✅ SUCCESS! API is working!');
        console.log('📝 Response:', text);
        console.log('\n🎉 Your Gemini API is configured correctly!');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);

        if (error.message.includes('404') || error.message.includes('Not Found')) {
            console.log('\n🔧 SOLUTION:');
            console.log('1. Go to: https://aistudio.google.com/app/apikey');
            console.log('2. Click on your API key');
            console.log('3. Click "Enable API" or "Enable Generative Language API"');
            console.log('4. Wait 2-3 minutes');
            console.log('5. Run this test again');
        } else if (error.message.includes('API key not valid')) {
            console.log('\n🔧 SOLUTION:');
            console.log('1. Go to: https://aistudio.google.com/app/apikey');
            console.log('2. Create a new API key');
            console.log('3. Update GEMINI_API_KEY in backend/.env');
            console.log('4. Restart server');
        } else {
            console.log('\n📋 Full error:', error);
        }
    }
}

testGeminiAPI();
