import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

// Get site settings
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error.message
        });
    }
});

// Update site settings
router.put('/', authenticate, logActivity('update', 'settings'), async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
});

export default router;
