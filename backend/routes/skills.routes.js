import express from 'express';
import Skill from '../models/Skill.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { skillValidation, idValidation } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find({ isVisible: true }).sort({ category: 1, order: 1 });

        res.json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch skills',
            error: error.message
        });
    }
});

// @route   GET /api/skills/all (admin only)
// @desc    Get all skills including hidden ones
// @access  Private
router.get('/all', authenticate, async (req, res) => {
    try {
        const skills = await Skill.find().sort({ category: 1, order: 1 });

        res.json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (error) {
        console.error('Get all skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch skills',
            error: error.message
        });
    }
});

// @route   GET /api/skills/:id
// @desc    Get skill by ID
// @access  Public
router.get('/:id', idValidation, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.json({
            success: true,
            data: skill
        });
    } catch (error) {
        console.error('Get skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch skill',
            error: error.message
        });
    }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private
router.post('/', authenticate, logActivity('create', 'skill'), skillValidation, async (req, res) => {
    try {
        const skill = await Skill.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: skill
        });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create skill',
            error: error.message
        });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', authenticate, logActivity('update', 'skill'), idValidation, skillValidation, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.json({
            success: true,
            message: 'Skill updated successfully',
            data: skill
        });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update skill',
            error: error.message
        });
    }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', authenticate, logActivity('delete', 'skill'), idValidation, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete skill',
            error: error.message
        });
    }
});

export default router;
