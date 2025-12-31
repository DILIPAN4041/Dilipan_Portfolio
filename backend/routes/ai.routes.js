import express from 'express';
import { authenticate } from '../middleware/auth.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// @route   POST /api/ai/generate
// @desc    Generate AI content suggestions
// @access  Private
router.post('/generate', authenticate, async (req, res) => {
    try {
        const { type, context } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Type is required (about, skill, project, blog, funfact, experience, chat)'
            });
        }

        const result = await aiService.generateContent(context, type);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('AI generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate AI content',
            error: error.message
        });
    }
});

// @route   POST /api/ai/chat
// @desc    AI chatbot conversation
// @access  Private
router.post('/chat', authenticate, async (req, res) => {
    try {
        const { message } = req.body;

        const result = await aiService.generateContent(message, 'chat');

        res.json({
            success: true,
            data: {
                message: result.suggestion,
                provider: result.provider,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message',
            error: error.message
        });
    }
});

// @route   GET /api/ai/status
// @desc    Get AI service status
// @access  Private
router.get('/status', authenticate, async (req, res) => {
    try {
        const provider = aiService.provider;
        const isConfigured = provider !== 'mock';

        res.json({
            success: true,
            data: {
                provider,
                configured: isConfigured,
                available: true,
                message: isConfigured
                    ? `AI service active using ${provider}`
                    : 'Using mock AI responses. Configure API key for real AI suggestions.'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get AI status',
            error: error.message
        });
    }
});

// @route   POST /api/ai/rephrase
// @desc    Rephrase text to be more professional
// @access  Private
router.post('/rephrase', authenticate, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        const result = await aiService.rephraseText(text);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('AI rephrase error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to rephrase text',
            error: error.message
        });
    }
});

// @route   POST /api/ai/seo-description
// @desc    Generate SEO meta description
// @access  Private
router.post('/seo-description', authenticate, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const result = await aiService.generateSEODescription(content);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('AI SEO description error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate SEO description',
            error: error.message
        });
    }
});

// @route   POST /api/ai/seo-title
// @desc    Generate SEO title
// @access  Private
router.post('/seo-title', authenticate, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const result = await aiService.generateSEOTitle(content);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('AI SEO title error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate SEO title',
            error: error.message
        });
    }
});

// @route   POST /api/ai/keywords
// @desc    Generate SEO keywords
// @access  Private
router.post('/keywords', authenticate, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const result = await aiService.generateKeywords(content);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('AI keywords error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate keywords',
            error: error.message
        });
    }
});

export default router;
