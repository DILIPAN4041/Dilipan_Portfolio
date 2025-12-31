import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add index for faster queries
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ isRead: 1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
