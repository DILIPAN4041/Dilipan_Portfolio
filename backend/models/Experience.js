import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    achievements: [{
        type: String,
        trim: true
    }],
    companyUrl: {
        type: String,
        default: ''
    },
    companyLogo: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for sorting (most recent first)
experienceSchema.index({ startDate: -1 });

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
