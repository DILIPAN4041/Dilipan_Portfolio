// Centralized Error Handler Middleware

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Not Found Handler
export const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: error.message,
            stack: err.stack,
            statusCode: error.statusCode
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new AppError(message, 401);
    }

    // Send error response
    res.status(error.statusCode).json({
        success: false,
        error: {
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// Async handler wrapper to catch errors in async routes
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { AppError };
