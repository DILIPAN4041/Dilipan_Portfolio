import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'],
        default: 'Other'
    },
    proficiency: {
        type: Number,
        required: [true, 'Proficiency level is required'],
        min: [0, 'Proficiency cannot be less than 0'],
        max: [100, 'Proficiency cannot exceed 100'],
        default: 50
    },
    icon: {
        type: String,
        default: ''
    },
    yearsOfExperience: {
        type: Number,
        default: 0
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
skillSchema.index({ category: 1, order: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
