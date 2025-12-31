import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent)
    },
    {
        path: 'messages',
        loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./about-admin/about-admin.component').then(m => m.AboutAdminComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile-admin/profile-admin.component').then(m => m.ProfileAdminComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./contact-admin/contact-admin.component').then(m => m.ContactAdminComponent)
    },
    {
        path: 'projects',
        loadComponent: () => import('./projects-admin/projects-admin.component').then(m => m.ProjectsAdminComponent)
    },
    {
        path: 'blogs',
        loadComponent: () => import('./blogs-admin/blogs-admin.component').then(m => m.BlogsAdminComponent)
    },
    {
        path: 'skills',
        loadComponent: () => import('./skills-admin/skills-admin.component').then(m => m.SkillsAdminComponent)
    },
    {
        path: 'experience',
        loadComponent: () => import('./experience-admin/experience-admin.component').then(m => m.ExperienceAdminComponent)
    },
    {
        path: 'fun-facts',
        loadComponent: () => import('./funfacts-admin/funfacts-admin.component').then(m => m.FunFactsAdminComponent)
    }
];
