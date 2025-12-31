import { body, param, validationResult } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Common validation rules
export const loginValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or User ID is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validate
];

export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    validate
];

export const createUserValidation = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isLength({ min: 3 })
        .withMessage('User ID must be at least 3 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validate
];

export const profileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('role')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Role cannot be empty'),
    body('bio')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Bio cannot exceed 1000 characters'),
    validate
];

export const skillValidation = [
    body('name')
        .notEmpty()
        .withMessage('Skill name is required')
        .trim(),
    body('category')
        .optional()
        .isIn(['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'])
        .withMessage('Invalid category'),
    body('proficiency')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Proficiency must be between 0 and 100'),
    validate
];

export const projectValidation = [
    body('title')
        .notEmpty()
        .withMessage('Project title is required')
        .trim(),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('techStack')
        .optional()
        .isArray()
        .withMessage('Tech stack must be an array'),
    validate
];

export const idValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    validate
];
