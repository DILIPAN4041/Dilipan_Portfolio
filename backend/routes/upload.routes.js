import express from 'express';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';
import imageService from '../services/imageService.js';

const router = express.Router();

// Upload single image
router.post('/single', authenticate, logActivity('create', 'upload'), uploadSingle, handleUploadError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Optimize image
        const optimized = await imageService.optimizeImage(req.file.path, {
            width: 1200,
            quality: 80,
            format: 'webp'
        });

        // Create thumbnail
        const thumbnail = await imageService.createThumbnail(req.file.path, 300);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                original: {
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    url: imageService.getImageUrl(req.file.filename, false)
                },
                optimized: optimized.success ? {
                    filename: optimized.filename,
                    url: imageService.getImageUrl(optimized.filename, true)
                } : null,
                thumbnail: thumbnail.success ? {
                    filename: thumbnail.filename,
                    url: imageService.getImageUrl(thumbnail.filename, true)
                } : null
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

// Upload multiple images
router.post('/multiple', authenticate, logActivity('create', 'upload'), uploadMultiple, handleUploadError, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            // Optimize each image
            const optimized = await imageService.optimizeImage(file.path, {
                width: 1200,
                quality: 80,
                format: 'webp'
            });

            uploadedFiles.push({
                original: {
                    filename: file.filename,
                    size: file.size,
                    url: imageService.getImageUrl(file.filename, false)
                },
                optimized: optimized.success ? {
                    filename: optimized.filename,
                    url: imageService.getImageUrl(optimized.filename, true)
                } : null
            });
        }

        res.json({
            success: true,
            message: `${uploadedFiles.length} images uploaded successfully`,
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
});

// Delete image
router.delete('/:filename', authenticate, logActivity('delete', 'upload'), async (req, res) => {
    try {
        const { filename } = req.params;

        const result = await imageService.deleteImage(filename);

        if (result.success) {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete image',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
});

export default router;
