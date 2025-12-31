/**
 * Environment Variables Validation
 * Ensures all required environment variables are set before starting the server
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV',
    'FRONTEND_URL'
];

const optionalEnvVars = [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
    'SENDGRID_TO_EMAIL',
    'HUGGINGFACE_API_KEY',
    'OPENAI_API_KEY'
];

function validateEnvironment() {
    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Check optional but recommended variables
    if (!process.env.SENDGRID_API_KEY) {
        warnings.push('SENDGRID_API_KEY not set - Contact form emails will not be sent');
    }

    // Report missing required variables
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease check your .env file and ensure all required variables are set.');
        console.error('See .env.example for reference.\n');
        process.exit(1);
    }

    // Report warnings
    if (warnings.length > 0) {
        console.warn('⚠️  Warnings:');
        warnings.forEach(warning => {
            console.warn(`   - ${warning}`);
        });
        console.warn('');
    }

    // Success message
    console.log('✅ Environment variables validated successfully\n');
}

module.exports = { validateEnvironment };
