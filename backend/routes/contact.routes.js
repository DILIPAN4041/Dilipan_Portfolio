import express from 'express';
import Contact from '../models/Contact.js';
import ContactMessage from '../models/ContactMessage.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../middleware/activityLogger.js';

const router = express.Router();

// Get contact info
router.get('/', async (req, res) => {
    try {
        let contact = await Contact.findOne({ isVisible: true });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact information not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact info',
            error: error.message
        });
    }
});

// Update contact info
router.put('/', authenticate, logActivity('update', 'contact'), async (req, res) => {
    try {
        let contact = await Contact.findOne();

        if (!contact) {
            contact = await Contact.create(req.body);
        } else {
            Object.assign(contact, req.body);
            await contact.save();
        }

        res.json({
            success: true,
            message: 'Contact information updated successfully',
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update contact info',
            error: error.message
        });
    }
});

// Submit contact form (public endpoint)
router.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        // Save message to database
        const contactMessage = await ContactMessage.create({ name, email, phone, message });
        console.log(`✅ Contact message saved to database from ${name}`);

        // Import the new email service
        const { sendContactNotification, sendAutoReply } = await import('../src/services/email.service.js');

        // Send email notification to admin
        const emailResult = await sendContactNotification({
            name,
            email,
            subject: phone ? `Contact from ${name} (${phone})` : `Contact from ${name}`,
            message
        });

        // Send auto-reply to user
        if (emailResult.success) {
            await sendAutoReply({ name, email });
        }

        res.json({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.',
            emailSent: emailResult.success
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form',
            error: error.message
        });
    }
});

// Get all contact messages (admin only)
router.get('/messages', authenticate, async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .select('name email phone message isRead createdAt');

        const unreadCount = await ContactMessage.countDocuments({ isRead: false });

        res.json({
            success: true,
            data: messages,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
});

// Mark message as read/unread (admin only)
router.patch('/messages/:id/read', authenticate, async (req, res) => {
    try {
        const { isRead } = req.body;
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { isRead },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: `Message marked as ${isRead ? 'read' : 'unread'}`,
            data: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update message',
            error: error.message
        });
    }
});

// Delete message (admin only)
router.delete('/messages/:id', authenticate, logActivity('delete', 'contact-message'), async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message
        });
    }
});

export default router;
