import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ContentService } from '../../../services/content.service';
import { VisibilityService } from '../../../services/visibility.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTabsModule,
        MatSlideToggleModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    loading = signal(true);
    saving = signal(false);

    settings: any = {
        siteName: '',
        tagline: '',
        metaDescription: ''
    };

    sectionsVisibility = {
        about: true,
        skills: true,
        projects: true,
        experience: true,
        blogs: true,
        funfacts: true,
        contact: true
    };

    heroContent = {
        home: {
            title: 'Crafting Digital Experiences, One Line of Code at a Time.',
            description: "Hi, I'm {name}. A passionate {role} blending technical expertise with creative problem-solving to build impactful web applications."
        },
        about: {
            title: 'About Me'
        },
        skills: {
            title: 'My Skills & Expertise',
            description: 'A comprehensive overview of my technical skills and proficiency levels across various technologies and tools.'
        },
        projects: {
            title: 'My Projects',
            description: 'Explore my portfolio of web applications, showcasing my expertise in full-stack development and creative problem-solving.'
        },
        experience: {
            title: 'Professional Experience',
            description: 'My professional journey and career milestones, highlighting key roles and achievements in software development.'
        },
        blogs: {
            title: 'Blog & Insights',
            description: 'Thoughts, tutorials, and insights on web development, technology trends, and software engineering best practices.'
        },
        funfacts: {
            title: 'Fun Facts About Me',
            description: 'Beyond the code - interesting tidbits and personal highlights that make me who I am.'
        },
        contact: {
            title: 'Get In Touch',
            description: "Have a project in mind or just want to connect? I'd love to hear from you!"
        }
    };

    constructor(private contentService: ContentService, private visibilityService: VisibilityService) { }

    ngOnInit() {
        this.loadSettings();
        this.loadVisibility();
        this.loadHeroContent();
    }

    loadSettings() {
        this.contentService.getSettings().subscribe({
            next: (settings: any) => {
                this.settings = { ...this.settings, ...settings };

                // Load visibility from backend if available
                if (settings.sectionsVisibility) {
                    this.sectionsVisibility = { ...this.sectionsVisibility, ...settings.sectionsVisibility };
                }

                this.loading.set(false);
            },
            error: (err: any) => {
                console.error('Failed to load settings:', err);
                this.loading.set(false);
            }
        });
    }

    loadVisibility() {
        // Load from localStorage as backup
        const saved = localStorage.getItem('sections_visibility');
        if (saved) {
            this.sectionsVisibility = { ...this.sectionsVisibility, ...JSON.parse(saved) };
        }
    }

    loadHeroContent() {
        // Load hero content from localStorage
        const savedHome = localStorage.getItem('hero_home');
        if (savedHome) this.heroContent.home = JSON.parse(savedHome);

        const savedAbout = localStorage.getItem('hero_about');
        if (savedAbout) this.heroContent.about = JSON.parse(savedAbout);

        const savedSkills = localStorage.getItem('hero_skills');
        if (savedSkills) this.heroContent.skills = JSON.parse(savedSkills);

        const savedProjects = localStorage.getItem('hero_projects');
        if (savedProjects) this.heroContent.projects = JSON.parse(savedProjects);

        const savedExperience = localStorage.getItem('hero_experience');
        if (savedExperience) this.heroContent.experience = JSON.parse(savedExperience);

        const savedBlogs = localStorage.getItem('hero_blogs');
        if (savedBlogs) this.heroContent.blogs = JSON.parse(savedBlogs);

        const savedFunfacts = localStorage.getItem('hero_funfacts');
        if (savedFunfacts) this.heroContent.funfacts = JSON.parse(savedFunfacts);

        const savedContact = localStorage.getItem('hero_contact');
        if (savedContact) this.heroContent.contact = JSON.parse(savedContact);
    }

    saveSettings() {
        this.saving.set(true);
        this.contentService.updateSettings(this.settings).subscribe({
            next: () => {
                this.saving.set(false);
                alert('General settings saved successfully!');
            },
            error: (err: any) => {
                this.saving.set(false);
                alert('Failed to save settings: ' + (err.message || 'Unknown error'));
            }
        });
    }

    saveVisibility() {
        this.saving.set(true);

        // Update the visibility service (this will update navbar immediately)
        this.visibilityService.updateVisibility(this.sectionsVisibility);

        // Save to backend
        this.contentService.updateSettings({ sectionsVisibility: this.sectionsVisibility }).subscribe({
            next: () => {
                this.saving.set(false);
                alert('Section visibility saved successfully! Navbar updated.');
            },
            error: (err: any) => {
                this.saving.set(false);
                alert('Failed to save visibility: ' + (err.message || 'Unknown error'));
            }
        });
    }

    saveHeroContent() {
        this.saving.set(true);

        // Save each page's hero content to localStorage
        localStorage.setItem('hero_home', JSON.stringify(this.heroContent.home));
        localStorage.setItem('hero_about', JSON.stringify(this.heroContent.about));
        localStorage.setItem('hero_skills', JSON.stringify(this.heroContent.skills));
        localStorage.setItem('hero_projects', JSON.stringify(this.heroContent.projects));
        localStorage.setItem('hero_experience', JSON.stringify(this.heroContent.experience));
        localStorage.setItem('hero_blogs', JSON.stringify(this.heroContent.blogs));
        localStorage.setItem('hero_funfacts', JSON.stringify(this.heroContent.funfacts));
        localStorage.setItem('hero_contact', JSON.stringify(this.heroContent.contact));

        setTimeout(() => {
            this.saving.set(false);
            alert('Hero content saved successfully!');
        }, 500);
    }
}
