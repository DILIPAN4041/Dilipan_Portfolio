import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    profile = signal<any>(null);
    loading = signal(true);

    milestones = [
        {
            year: '2020',
            title: 'Started Full-Stack Development Journey',
            description: 'Began learning web development with a focus on modern JavaScript frameworks and backend technologies.',
            icon: 'rocket_launch'
        },
        {
            year: '2021',
            title: 'First Professional Project',
            description: 'Delivered my first production-ready web application, gaining valuable real-world experience.',
            icon: 'work'
        },
        {
            year: '2022',
            title: 'Mastered Modern Tech Stack',
            description: 'Achieved proficiency in Angular, Node.js, MongoDB, and cloud deployment technologies.',
            icon: 'school'
        },
        {
            year: '2023',
            title: 'Led Development Team',
            description: 'Took on leadership role, mentoring junior developers and architecting complex systems.',
            icon: 'groups'
        }
    ];

    interests = [
        { icon: 'code', title: 'Coding & Tech', description: 'Passionate about exploring new technologies and building innovative solutions' },
        { icon: 'palette', title: 'UI/UX Design', description: 'Creating beautiful, user-friendly interfaces that delight users' },
        { icon: 'book', title: 'Continuous Learning', description: 'Always expanding my knowledge through courses, books, and hands-on projects' },
        { icon: 'fitness_center', title: 'Fitness', description: 'Maintaining a healthy lifestyle through regular exercise and outdoor activities' },
        { icon: 'music_note', title: 'Music', description: 'Enjoying and creating music as a creative outlet' },
        { icon: 'travel_explore', title: 'Travel', description: 'Exploring new places and experiencing different cultures' }
    ];

    philosophy = {
        paragraph1: 'I believe that great software is born from the perfect blend of technical excellence and creative problem-solving. My approach centers on understanding user needs deeply, crafting elegant solutions, and writing clean, maintainable code that stands the test of time.',
        paragraph2: "I'm passionate about creating robust, scalable, and intuitive applications that make a real difference. Every project is an opportunity to learn, grow, and push the boundaries of what's possible with modern web technologies."
    };

    constructor(private contentService: ContentService, private meta: MetaService) { }

    ngOnInit() {
        this.meta.updateTags(SEO_CONFIG.about);
        this.loadProfile();
        this.loadMilestonesAndInterests();
    }

    loadMilestonesAndInterests() {
        // Load philosophy from localStorage or use defaults
        const savedPhilosophy = localStorage.getItem('about_philosophy');
        if (savedPhilosophy) {
            this.philosophy = JSON.parse(savedPhilosophy);
        }

        // Load milestones from localStorage or use defaults
        const savedMilestones = localStorage.getItem('about_milestones');
        if (savedMilestones) {
            this.milestones = JSON.parse(savedMilestones);
        }

        // Load interests from localStorage or use defaults
        const savedInterests = localStorage.getItem('about_interests');
        if (savedInterests) {
            this.interests = JSON.parse(savedInterests);
        }
    }

    loadProfile() {
        this.contentService.getProfile().subscribe({
            next: (profile) => {
                this.profile.set(profile);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading profile:', error);
                this.loading.set(false);
            }
        });
    }
}
