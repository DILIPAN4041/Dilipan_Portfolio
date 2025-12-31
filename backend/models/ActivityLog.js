import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
        enum: ['login', 'logout', 'create', 'update', 'delete', 'password_change', 'user_added', 'user_deleted']
    },
    resource: {
        type: String,
        required: [true, 'Resource is required'],
        enum: ['auth', 'profile', 'skill', 'project', 'experience', 'blog', 'funfact', 'contact', 'settings', 'user']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ resource: 1, action: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
