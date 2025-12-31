import express from 'express';
import Blog from '../models/Blog.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import { idValidation } from '../middleware/validation.js';

const router = express.Router();

// Get all published blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true, isVisible: true })
            .sort({ publishedAt: -1 })
            .select('-content'); // Exclude full content for list view

        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error.message
        });
    }
});

// Get all blogs (Admin)
router.get('/all', authenticate, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error.message
        });
    }
});

// Get blog by slug or ID
router.get('/:identifier', async (req, res) => {
    try {
        let blog;

        // Try to find by slug first
        blog = await Blog.findOne({ slug: req.params.identifier });

        // If not found and identifier looks like ObjectId, try by ID
        if (!blog && req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(req.params.identifier);
        }

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
            error: error.message
        });
    }
});

// Create blog
router.post('/', authenticate, logActivity('create', 'blog'), async (req, res) => {
    try {
        const blog = await Blog.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: error.message
        });
    }
});

// Update blog
router.put('/:id', authenticate, logActivity('update', 'blog'), idValidation, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error.message
        });
    }
});

// Delete blog
router.delete('/:id', authenticate, logActivity('delete', 'blog'), idValidation, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog',
            error: error.message
        });
    }
});

export default router;
