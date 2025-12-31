import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
