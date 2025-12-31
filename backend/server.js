import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import funfactsRoutes from './routes/funfacts.routes.js';
import contactRoutes from './routes/contact.routes.js';
import usersRoutes from './routes/users.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import activityRoutes from './routes/activity.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/funfacts', funfactsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 Welcome to Dilipan\'s Portfolio API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            profile: '/api/profile',
            skills: '/api/skills',
            projects: '/api/projects',
            experience: '/api/experience',
            blogs: '/api/blogs',
            funfacts: '/api/funfacts',
            contact: '/api/contact',
            users: '/api/users',
            settings: '/api/settings',
            activity: '/api/activity',
            ai: '/api/ai'
        }
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});

export default app;
