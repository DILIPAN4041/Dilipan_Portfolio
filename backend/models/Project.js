import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    longDescription: {
        type: String,
        maxlength: [3000, 'Long description cannot exceed 3000 characters']
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/600x400'
    },
    demoUrl: {
        type: String,
        default: ''
    },
    codeUrl: {
        type: String,
        default: ''
    },
    techStack: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['Web', 'Mobile', 'Desktop', 'API', 'Other'],
        default: 'Web'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
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

// Index for sorting
projectSchema.index({ featured: -1, order: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
