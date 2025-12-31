import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
    experiences = signal<any[]>([]);
    loading = signal(true);

    heroContent = {
        title: 'Professional Experience',
        description: 'My professional journey and career milestones, highlighting key roles and achievements in software development.'
    };
    expandedIndex = signal<number | null>(null);

    constructor(private contentService: ContentService, private meta: MetaService) { }

    ngOnInit() {
        this.loadHeroContent();
        this.meta.updateTags(SEO_CONFIG.experience);
        this.loadExperience();
    }

    loadHeroContent() {
        const saved = localStorage.getItem('hero_experience');
        if (saved) {
            this.heroContent = JSON.parse(saved);
        }
    }

    loadExperience() {
        this.contentService.getExperience().subscribe({
            next: (experiences) => {
                this.experiences.set(experiences);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading experience:', error);
                this.loading.set(false);
            }
        });
    }

    toggleExpand(index: number) {
        this.expandedIndex.set(this.expandedIndex() === index ? null : index);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}
