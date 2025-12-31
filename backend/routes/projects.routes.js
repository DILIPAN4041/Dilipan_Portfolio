import express from 'express';
import Project from '../models/Project.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { projectValidation, idValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all visible projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ isVisible: true })
            .sort({ featured: -1, order: 1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
});

// Get all projects including hidden (Admin)
router.get('/all', authenticate, async (req, res) => {
    try {
        const projects = await Project.find().sort({ featured: -1, order: 1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
});

// Get single project
router.get('/:id', idValidation, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
});

// Create project
router.post('/', authenticate, logActivity('create', 'project'), projectValidation, async (req, res) => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
});

// Update project
router.put('/:id', authenticate, logActivity('update', 'project'), idValidation, projectValidation, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update project',
            error: error.message
        });
    }
});

// Delete project
router.delete('/:id', authenticate, logActivity('delete', 'project'), idValidation, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete project',
            error: error.message
        });
    }
});

export default router;
