// SEO Meta Tags Configuration for All Public Pages
// Import and use in each component's ngOnInit()

export const SEO_CONFIG = {
    home: {
        title: 'Home',
        description: 'Welcome to my portfolio. I\'m a passionate full-stack developer specializing in modern web technologies like Angular, Node.js, and MongoDB. Explore my projects and skills.',
        keywords: 'full-stack developer, web development, Angular developer, Node.js, MongoDB, TypeScript, portfolio, software engineer'
    },

    about: {
        title: 'About Me',
        description: 'Learn more about my journey as a full-stack developer, my passion for technology, and the skills I bring to every project. Dedicated to creating innovative web solutions.',
        keywords: 'about me, developer bio, full-stack developer, web developer, software engineer, career, experience'
    },

    projects: {
        title: 'Projects',
        description: 'Explore my portfolio of web development projects showcasing expertise in Angular, Node.js, MongoDB, and modern web technologies. Real-world applications and innovative solutions.',
        keywords: 'web projects, portfolio projects, Angular projects, Node.js applications, full-stack projects, web development'
    },

    skills: {
        title: 'Skills & Technologies',
        description: 'Discover my technical skills and expertise in modern web development. Proficient in Angular, React, Node.js, MongoDB, TypeScript, and more cutting-edge technologies.',
        keywords: 'technical skills, web development skills, Angular, React, Node.js, MongoDB, TypeScript, JavaScript, programming skills'
    },

    contact: {
        title: 'Contact Me',
        description: 'Get in touch for collaboration opportunities, project inquiries, or just to connect. I\'m always open to discussing new projects and innovative ideas.',
        keywords: 'contact, get in touch, hire developer, collaboration, project inquiry, email, connect'
    },

    experience: {
        title: 'Work Experience',
        description: 'Explore my professional journey and work experience as a full-stack developer. Learn about the projects I\'ve contributed to and the impact I\'ve made.',
        keywords: 'work experience, professional experience, career history, developer experience, employment history'
    },

    blogs: {
        title: 'Blog & Articles',
        description: 'Read my latest blog posts and articles about web development, programming tips, technology trends, and insights from my development journey.',
        keywords: 'blog, articles, web development blog, programming tips, tech articles, developer blog, coding tutorials'
    },

    funFacts: {
        title: 'Fun Facts',
        description: 'Discover interesting and fun facts about me beyond coding. Get to know the person behind the developer through unique insights and personal interests.',
        keywords: 'fun facts, personal interests, hobbies, about developer, personality, interests'
    }
};

// Usage in component:
// import { SEO_CONFIG } from './seo-config';
// this.meta.updateTags(SEO_CONFIG.about);
