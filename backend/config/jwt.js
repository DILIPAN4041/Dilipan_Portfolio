import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'default-secret-key-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
