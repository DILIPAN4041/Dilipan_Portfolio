import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    thumbnail: {
        type: String,
        default: 'https://via.placeholder.com/800x450'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    readTime: {
        type: Number, // in minutes
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        default: 'Dilipan'
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from title if not provided
blogSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Set publishedAt when published
    if (this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

// Index for searching and sorting
blogSchema.index({ published: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
