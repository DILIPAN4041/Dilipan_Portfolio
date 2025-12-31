import mongoose from 'mongoose';

const funFactSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '✨'
    },
    category: {
        type: String,
        enum: ['Achievement', 'Hobby', 'Fact', 'Quote', 'Other'],
        default: 'Fact'
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
funFactSchema.index({ order: 1 });

const FunFact = mongoose.model('FunFact', funFactSchema);

export default FunFact;
