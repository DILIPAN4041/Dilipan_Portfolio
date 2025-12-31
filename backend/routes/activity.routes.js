import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all activity logs
router.get('/', authenticate, async (req, res) => {
    try {
        const { limit = 50, page = 1, userId, action, resource } = req.query;

        const query = {};

        if (userId) query.userId = userId;
        if (action) query.action = action;
        if (resource) query.resource = resource;

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('userId', 'email userId');

        const total = await ActivityLog.countDocuments(query);

        res.json({
            success: true,
            count: logs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs',
            error: error.message
        });
    }
});

// Get activity log stats
router.get('/stats', authenticate, async (req, res) => {
    try {
        const totalLogs = await ActivityLog.countDocuments();
        const recentLogs = await ActivityLog.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        const actionStats = await ActivityLog.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalLogs,
                last24Hours: recentLogs,
                byAction: actionStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity stats',
            error: error.message
        });
    }
});

export default router;
