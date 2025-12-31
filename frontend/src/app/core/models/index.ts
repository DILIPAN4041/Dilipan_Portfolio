// User
export interface User {
    _id: string;
    email: string;
    userId: string;
    mustChangePassword: boolean;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Profile
export interface Profile {
    _id: string;
    name: string;
    role: string;
    location: string;
    bio: string;
    avatarUrl: string;
    resumeUrl: string;
    tagline?: string;
    yearsOfExperience?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Skill
export interface Skill {
    _id: string;
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'Other';
    proficiency: number;
    icon?: string;
    yearsOfExperience?: number;
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Project
export interface Project {
    _id: string;
    title: string;
    description: string;
    longDescription?: string;
    imageUrl: string;
    demoUrl?: string;
    codeUrl?: string;
    techStack: string[];
    featured: boolean;
    category: 'Web' | 'Mobile' | 'Desktop' | 'API' | 'Other';
    startDate?: Date;
    endDate?: Date;
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Experience
export interface Experience {
    _id: string;
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
    companyUrl?: string;
    companyLogo?: string;
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Blog
export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    readTime: number;
    views: number;
    author: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// FunFact
export interface FunFact {
    _id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Achievement' | 'Hobby' | 'Fact' | 'Quote' | 'Other';
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Contact
export interface Contact {
    _id: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
    address?: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// SiteSettings
export interface SiteSettings {
    _id: string;
    defaultTheme: 'light' | 'dark';
    sectionsVisibility: {
        about: boolean;
        skills: boolean;
        projects: boolean;
        experience: boolean;
        blogs: boolean;
        funfacts: boolean;
        contact: boolean;
    };
    maintenanceMode: boolean;
    maintenanceMessage: string;
    siteTitle: string;
    siteDescription: string;
    metaKeywords: string[];
    googleAnalyticsId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ActivityLog
export interface ActivityLog {
    _id: string;
    userId: string;
    userEmail: string;
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'password_change' | 'user_added' | 'user_deleted';
    resource: 'auth' | 'profile' | 'skill' | 'project' | 'experience' | 'blog' | 'funfact' | 'contact' | 'settings' | 'user';
    resourceId?: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

// API Response
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
}

// Auth
export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        userId: string;
        mustChangePassword: boolean;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// AI
export interface AIGenerateRequest {
    type: 'about' | 'skill' | 'project' | 'blog' | 'funfact' | 'experience' | 'chat';
    context?: string;
}

export interface AIGenerateResponse {
    suggestion: string;
    provider: 'huggingface' | 'openai' | 'mock';
    note?: string;
}
