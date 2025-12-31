import express from 'express';
import Experience from '../models/Experience.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { idValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all visible experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find({ isVisible: true })
            .sort({ startDate: -1 });

        res.json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experiences',
            error: error.message
        });
    }
});

// Get all experiences (Admin)
router.get('/all', authenticate, async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ startDate: -1 });

        res.json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experiences',
            error: error.message
        });
    }
});

// Get single experience
router.get('/:id', idValidation, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.json({
            success: true,
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experience',
            error: error.message
        });
    }
});

// Create experience
router.post('/', authenticate, logActivity('create', 'experience'), async (req, res) => {
    try {
        const experience = await Experience.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Experience created successfully',
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create experience',
            error: error.message
        });
    }
});

// Update experience
router.put('/:id', authenticate, logActivity('update', 'experience'), idValidation, async (req, res) => {
    try {
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.json({
            success: true,
            message: 'Experience updated successfully',
            data: experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update experience',
            error: error.message
        });
    }
});

// Delete experience
router.delete('/:id', authenticate, logActivity('delete', 'experience'), idValidation, async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.json({
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete experience',
            error: error.message
        });
    }
});

export default router;
