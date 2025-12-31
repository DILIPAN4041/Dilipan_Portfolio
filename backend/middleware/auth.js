import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Check if user still exists
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists or is inactive.'
            });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            userId: user.userId
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message
        });
    }
};
