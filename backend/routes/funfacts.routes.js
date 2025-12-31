import express from 'express';
import FunFact from '../models/FunFact.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { idValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all visible fun facts
router.get('/', async (req, res) => {
    try {
        const funfacts = await FunFact.find({ isVisible: true }).sort({ order: 1 });

        res.json({
            success: true,
            count: funfacts.length,
            data: funfacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fun facts',
            error: error.message
        });
    }
});

// Get all fun facts (Admin)
router.get('/all', authenticate, async (req, res) => {
    try {
        const funfacts = await FunFact.find().sort({ order: 1 });

        res.json({
            success: true,
            count: funfacts.length,
            data: funfacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fun facts',
            error: error.message
        });
    }
});

// Create fun fact
router.post('/', authenticate, logActivity('create', 'funfact'), async (req, res) => {
    try {
        const funfact = await FunFact.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Fun fact created successfully',
            data: funfact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create fun fact',
            error: error.message
        });
    }
});

// Update fun fact
router.put('/:id', authenticate, logActivity('update', 'funfact'), idValidation, async (req, res) => {
    try {
        const funfact = await FunFact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!funfact) {
            return res.status(404).json({
                success: false,
                message: 'Fun fact not found'
            });
        }

        res.json({
            success: true,
            message: 'Fun fact updated successfully',
            data: funfact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update fun fact',
            error: error.message
        });
    }
});

// Delete fun fact
router.delete('/:id', authenticate, logActivity('delete', 'funfact'), idValidation, async (req, res) => {
    try {
        const funfact = await FunFact.findByIdAndDelete(req.params.id);

        if (!funfact) {
            return res.status(404).json({
                success: false,
                message: 'Fun fact not found'
            });
        }

        res.json({
            success: true,
            message: 'Fun fact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete fun fact',
            error: error.message
        });
    }
});

export default router;
