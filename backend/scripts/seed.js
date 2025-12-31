import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Blog from '../models/Blog.js';
import FunFact from '../models/FunFact.js';
import Contact from '../models/Contact.js';
import SiteSettings from '../models/SiteSettings.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('\n🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Profile.deleteMany({}),
            Skill.deleteMany({}),
            Project.deleteMany({}),
            Experience.deleteMany({}),
            Blog.deleteMany({}),
            FunFact.deleteMany({}),
            Contact.deleteMany({}),
            SiteSettings.deleteMany({})
        ]);
        console.log('✅ Existing data cleared\n');

        // Create admin users
        console.log('👤 Creating admin users...');
        const users = await User.create([
            {
                email: 'dilipanb200@gmail.com',
                userId: 'Dilipan_B',
                password: 'Admin@1234',
                mustChangePassword: true
            },
            {
                email: 'dheerandilipan@gmail.com',
                userId: 'Dilipan@8428',
                password: 'Admin@1234',
                mustChangePassword: true
            }
        ]);
        console.log(`✅ Created ${users.length} admin users\n`);

        // Create profile
        console.log('📝 Creating profile...');
        const profile = await Profile.create({
            name: 'Dilipan',
            role: 'Software Engineer / Full-stack Developer',
            location: 'Chennai, India',
            bio: 'Full-stack engineer proficient in C# .NET and Node.js. Passionate about building scalable, efficient applications and exploring modern web technologies.',
            tagline: 'Building the future, one line of code at a time',
            yearsOfExperience: 3,
            avatarUrl: 'https://ui-avatars.com/api/?name=Dilipan&size=200&background=6366f1&color=fff',
            resumeUrl: ''
        });
        console.log('✅ Profile created\n');

        // Create skills
        console.log('🛠️  Creating skills...');
        const skills = await Skill.create([
            // Frontend
            { name: 'Angular', category: 'Frontend', proficiency: 90, yearsOfExperience: 3, order: 1 },
            { name: 'React', category: 'Frontend', proficiency: 85, yearsOfExperience: 2, order: 2 },
            { name: 'TypeScript', category: 'Frontend', proficiency: 90, yearsOfExperience: 3, order: 3 },
            { name: 'HTML5/CSS3', category: 'Frontend', proficiency: 95, yearsOfExperience: 4, order: 4 },
            { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85, yearsOfExperience: 2, order: 5 },

            // Backend
            { name: 'C# .NET', category: 'Backend', proficiency: 90, yearsOfExperience: 3, order: 1 },
            { name: 'Node.js', category: 'Backend', proficiency: 88, yearsOfExperience: 3, order: 2 },
            { name: 'Express.js', category: 'Backend', proficiency: 85, yearsOfExperience: 2, order: 3 },
            { name: 'REST APIs', category: 'Backend', proficiency: 92, yearsOfExperience: 3, order: 4 },

            // Database
            { name: 'MongoDB', category: 'Database', proficiency: 85, yearsOfExperience: 2, order: 1 },
            { name: 'SQL Server', category: 'Database', proficiency: 88, yearsOfExperience: 3, order: 2 },
            { name: 'PostgreSQL', category: 'Database', proficiency: 80, yearsOfExperience: 2, order: 3 },

            // DevOps
            { name: 'Git', category: 'DevOps', proficiency: 90, yearsOfExperience: 4, order: 1 },
            { name: 'Docker', category: 'DevOps', proficiency: 75, yearsOfExperience: 1, order: 2 },
            { name: 'CI/CD', category: 'DevOps', proficiency: 80, yearsOfExperience: 2, order: 3 },

            // Tools
            { name: 'VS Code', category: 'Tools', proficiency: 95, yearsOfExperience: 4, order: 1 },
            { name: 'Visual Studio', category: 'Tools', proficiency: 88, yearsOfExperience: 3, order: 2 },
            { name: 'Postman', category: 'Tools', proficiency: 90, yearsOfExperience: 3, order: 3 }
        ]);
        console.log(`✅ Created ${skills.length} skills\n`);

        // Create projects
        console.log('💼 Creating projects...');
        const projects = await Project.create([
            {
                title: 'Portfolio Website',
                description: 'A modern, full-featured portfolio website with admin panel and AI integration',
                longDescription: 'Built with Angular 17+ and Node.js, featuring a comprehensive admin panel for content management, AI-powered content suggestions, and beautiful responsive design. Includes JWT authentication, MongoDB integration, and automated deployment.',
                techStack: ['Angular', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express.js', 'JWT'],
                featured: true,
                category: 'Web',
                order: 1,
                imageUrl: '/assets/images/project-portfolio.png',
                demoUrl: '',
                codeUrl: 'https://github.com/dilipan'
            },
            {
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
                longDescription: 'Comprehensive e-commerce platform built with modern technologies. Features include product management, shopping cart, secure checkout, payment gateway integration, order tracking, and analytics dashboard.',
                techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
                featured: true,
                category: 'Web',
                order: 2,
                imageUrl: '/assets/images/project-ecommerce.png'
            },
            {
                title: 'Task Management System',
                description: 'Collaborative task management application with real-time updates',
                longDescription: 'Team collaboration tool featuring real-time task updates, project boards, team chat, file sharing, and progress tracking. Built with focus on performance and user experience.',
                techStack: ['Angular', 'C# .NET', 'SQL Server', 'SignalR'],
                featured: false,
                category: 'Web',
                order: 3,
                imageUrl: '/assets/images/project-taskmanager.png'
            },
            {
                title: 'Weather Forecast App',
                description: 'Real-time weather application with location-based forecasts',
                longDescription: 'Beautiful weather application providing accurate forecasts, hourly and weekly predictions, interactive maps, and weather alerts. Features responsive design and offline capabilities.',
                techStack: ['React', 'OpenWeather API', 'Material-UI'],
                featured: false,
                category: 'Web',
                order: 4,
                imageUrl: '/assets/images/project-weather.png'
            }
        ]);
        console.log(`✅ Created ${projects.length} projects\n`);

        // Create experience
        console.log('💼 Creating experience...');
        const experiences = await Experience.create([
            {
                company: 'Tech Solutions Inc.',
                role: 'Senior Full-Stack Developer',
                location: 'Chennai, India',
                startDate: new Date('2022-01-01'),
                current: true,
                description: 'Leading development of enterprise web applications using Angular and .NET. Mentoring junior developers and implementing best practices across the team.',
                achievements: [
                    'Led migration to Angular 17 improving performance by 40%',
                    'Architected microservices infrastructure reducing deployment time by 60%',
                    'Mentored 5 junior developers improving team productivity',
                    'Implemented CI/CD pipeline automating testing and deployment'
                ],
                companyUrl: 'https://techsolutions.example.com',
                order: 1
            },
            {
                company: 'Digital Innovations',
                role: 'Full-Stack Developer',
                location: 'Chennai, India',
                startDate: new Date('2020-06-01'),
                endDate: new Date('2021-12-31'),
                current: false,
                description: 'Developed and maintained multiple client projects using React, Node.js, and MongoDB. Collaborated with design team to create intuitive user interfaces.',
                achievements: [
                    'Built 10+ responsive web applications serving 50K+ users',
                    'Reduced API response time by 50% through optimization',
                    'Implemented automated testing increasing code coverage to 85%',
                    'Collaborated with cross-functional teams on agile projects'
                ],
                companyUrl: 'https://digitalinnovations.example.com',
                order: 2
            },
            {
                company: 'StartUp Ventures',
                role: 'Junior Developer',
                location: 'Remote',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2020-05-31'),
                current: false,
                description: 'Contributed to development of MVPs for various startup projects. Gained experience in full development lifecycle from requirements to deployment.',
                achievements: [
                    'Developed frontend features using Angular and React',
                    'Created RESTful APIs with Node.js and Express',
                    'Participated in code reviews and agile ceremonies',
                    'Learned and applied modern development practices'
                ],
                order: 3
            }
        ]);
        console.log(`✅ Created ${experiences.length} experience entries\n`);

        // Create blogs
        console.log('📰 Creating blogs...');
        const blogs = await Blog.create([
            {
                title: 'Getting Started with Angular 17',
                slug: 'getting-started-with-angular-17',
                excerpt: 'Explore the latest features and improvements in Angular 17 and how to leverage them in your projects.',
                content: '# Getting Started with Angular 17\n\nAngular 17 brings exciting new features including standalone components, improved performance, and better developer experience...\n\n## Key Features\n\n- Standalone components by default\n- Improved SSR and hydration\n- Better type checking\n- Enhanced performance\n\n## Getting Started\n\n```typescript\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  template: `<h1>Hello Angular 17!</h1>`\n})\nexport class AppComponent {}\n```',
                tags: ['angular', 'typescript', 'web development'],
                published: true,
                publishedAt: new Date(),
                readTime: 5,
                thumbnail: 'https://via.placeholder.com/800x450/dc2626/ffffff?text=Angular+17'
            },
            {
                title: 'Building RESTful APIs with Node.js',
                slug: 'building-restful-apis-with-nodejs',
                excerpt: 'Learn how to build robust and scalable RESTful APIs using Node.js and Express.',
                content: '# Building RESTful APIs with Node.js\n\nNode.js and Express make it easy to build powerful RESTful APIs...',
                tags: ['nodejs', 'express', 'rest api', 'backend'],
                published: true,
                publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                readTime: 8,
                thumbnail: 'https://via.placeholder.com/800x450/059669/ffffff?text=Node.js+APIs'
            },
            {
                title: 'MongoDB Best Practices',
                slug: 'mongodb-best-practices',
                excerpt: 'Essential best practices for designing and optimizing MongoDB databases.',
                content: '# MongoDB Best Practices\n\nLearn the best practices for working with MongoDB...',
                tags: ['mongodb', 'database', 'nosql'],
                published: false,
                readTime: 6,
                thumbnail: 'https://via.placeholder.com/800x450/16a34a/ffffff?text=MongoDB'
            }
        ]);
        console.log(`✅ Created ${blogs.length} blog posts\n`);

        // Create fun facts
        console.log('✨ Creating fun facts...');
        const funfacts = await FunFact.create([
            {
                title: '☕ Coffee Enthusiast',
                description: 'Can\'t start coding without a perfect cup of coffee!',
                icon: '☕',
                category: 'Hobby',
                order: 1
            },
            {
                title: '🚀 Early Adopter',
                description: 'Always excited to explore and implement the latest web technologies',
                icon: '🚀',
                category: 'Fact',
                order: 2
            },
            {
                title: '📚 Continuous Learner',
                description: 'Completed 50+ online courses and certifications in web development',
                icon: '📚',
                category: 'Achievement',
                order: 3
            },
            {
                title: '🎮 Gaming Enthusiast',
                description: 'Enjoy strategy and puzzle games in free time',
                icon: '🎮',
                category: 'Hobby',
                order: 4
            },
            {
                title: '🌍 Open Source Contributor',
                description: 'Active contributor to various open-source projects',
                icon: '🌍',
                category: 'Achievement',
                order: 5
            },
            {
                title: '💡 Problem Solver',
                description: 'Love tackling complex challenges and finding elegant solutions',
                icon: '💡',
                category: 'Fact',
                order: 6
            }
        ]);
        console.log(`✅ Created ${funfacts.length} fun facts\n`);

        // Create contact info
        console.log('📞 Creating contact information...');
        const contact = await Contact.create({
            email: 'dilipanb200@gmail.com',
            phone: '+91 1234567890',
            linkedin: 'https://linkedin.com/in/dilipan',
            github: 'https://github.com/dilipan',
            instagram: 'https://instagram.com/dilipan',
            twitter: 'https://twitter.com/dilipan',
            address: 'Chennai, Tamil Nadu, India'
        });
        console.log('✅ Contact information created\n');

        // Create site settings
        console.log('⚙️  Creating site settings...');
        const settings = await SiteSettings.create({
            defaultTheme: 'dark',
            sectionsVisibility: {
                about: true,
                skills: true,
                projects: true,
                experience: true,
                blogs: true,
                funfacts: true,
                contact: true
            },
            maintenanceMode: false,
            siteTitle: "Dilipan's Portfolio",
            siteDescription: 'Full-stack Developer specializing in Angular, Node.js, and modern web technologies',
            metaKeywords: ['full-stack developer', 'angular', 'nodejs', 'web development', 'software engineer']
        });
        console.log('✅ Site settings created\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Profile: 1`);
        console.log(`   - Skills: ${skills.length}`);
        console.log(`   - Projects: ${projects.length}`);
        console.log(`   - Experience: ${experiences.length}`);
        console.log(`   - Blogs: ${blogs.length}`);
        console.log(`   - Fun Facts: ${funfacts.length}`);
        console.log(`   - Contact: 1`);
        console.log(`   - Settings: 1\n`);

        console.log('🔑 Admin Credentials:');
        console.log('   📧 Email: dilipanb200@gmail.com');
        console.log('   👤 User ID: Dilipan_B');
        console.log('   🔒 Password: Admin@1234');
        console.log('   ⚠️  Must change password on first login\n');
        console.log('   📧 Email: dheerandilipan@gmail.com');
        console.log('   👤 User ID: Dilipan@8428');
        console.log('   🔒 Password: Admin@1234');
        console.log('   ⚠️  Must change password on first login\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
