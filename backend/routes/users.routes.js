import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity, createActivityLog } from '../middleware/activityLogger.js';
import { createUserValidation, idValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Create new admin user
router.post('/', authenticate, logActivity('user_added', 'user'), createUserValidation, async (req, res) => {
    try {
        const { email, userId, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { userId }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or userId already exists'
            });
        }

        // Create new user
        const user = await User.create({
            email,
            userId,
            password,
            mustChangePassword: true
        });

        // Log activity
        await createActivityLog(
            req.user.id,
            req.user.email,
            'user_added',
            'user',
            `New admin user created: ${email}`,
            user._id
        );

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});

// Update user
router.put('/:id', authenticate, idValidation, async (req, res) => {
    try {
        const { userId: newUserId } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Only allow updating userId
        if (newUserId) {
            // Check if new userId is already taken
            const existingUser = await User.findOne({
                userId: newUserId,
                _id: { $ne: req.params.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID already taken'
                });
            }

            user.userId = newUserId;
            await user.save();
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
});

// Delete user
router.delete('/:id', authenticate, idValidation, async (req, res) => {
    try {
        // Check if this is the last admin
        const totalUsers = await User.countDocuments();

        if (totalUsers <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last admin account'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log activity before deletion
        await createActivityLog(
            req.user.id,
            req.user.email,
            'user_deleted',
            'user',
            `Admin user deleted: ${user.email}`,
            user._id
        );

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

export default router;
