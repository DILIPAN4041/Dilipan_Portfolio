import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { visibilityGuard } from './core/guards/visibility.guard';

export const routes: Routes = [
    // Public Routes
    {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'about',
        canActivate: [visibilityGuard('about')],
        loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'skills',
        canActivate: [visibilityGuard('skills')],
        loadComponent: () => import('./features/public/skills/skills.component').then(m => m.SkillsComponent)
    },
    {
        path: 'projects',
        canActivate: [visibilityGuard('projects')],
        loadComponent: () => import('./features/public/projects/projects.component').then(m => m.ProjectsComponent)
    },
    {
        path: 'projects/:id',
        canActivate: [visibilityGuard('projects')],
        loadComponent: () => import('./features/public/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
    },
    {
        path: 'experience',
        canActivate: [visibilityGuard('experience')],
        loadComponent: () => import('./features/public/experience/experience.component').then(m => m.ExperienceComponent)
    },
    {
        path: 'blogs',
        canActivate: [visibilityGuard('blogs')],
        loadComponent: () => import('./features/public/blogs/blogs.component').then(m => m.BlogsComponent)
    },
    {
        path: 'blogs/:slug',
        canActivate: [visibilityGuard('blogs')],
        loadComponent: () => import('./features/public/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
    },
    {
        path: 'fun-facts',
        canActivate: [visibilityGuard('funfacts')],
        loadComponent: () => import('./features/public/fun-facts/fun-facts.component').then(m => m.FunFactsComponent)
    },
    {
        path: 'contact',
        canActivate: [visibilityGuard('contact')],
        loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
    },

    // Auth Routes
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'change-password',
        loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent),
        canActivate: [authGuard]
    },

    // Admin Routes
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
    },

    // Fallback
    {
        path: '**',
        redirectTo: ''
    }
];
