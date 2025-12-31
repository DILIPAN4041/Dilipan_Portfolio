import express from 'express';
import Profile from '../models/Profile.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { profileValidation } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get profile
// @access  Public
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne();

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private
router.put('/', authenticate, logActivity('update', 'profile'), profileValidation, async (req, res) => {
    try {
        let profile = await Profile.findOne();

        if (!profile) {
            // Create new profile if doesn't exist
            profile = await Profile.create(req.body);
        } else {
            // Update existing profile
            Object.assign(profile, req.body);
            await profile.save();
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

export default router;
