import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
    selector: 'app-skills',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
    skills = signal<any[]>([]);
    loading = signal(true);
    activeCategory = signal<string>('All');

    heroContent = {
        title: 'My Skills & Expertise',
        description: 'A comprehensive overview of my technical skills and proficiency levels across various technologies and tools.'
    };

    categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Tools'];

    filteredSkills = computed(() => {
        const category = this.activeCategory();
        if (category === 'All') {
            return this.skills();
        }
        return this.skills().filter(skill => skill.category === category);
    });

    constructor(private contentService: ContentService, private meta: MetaService) { }

    ngOnInit() {
        this.loadHeroContent();
        this.meta.updateTags(SEO_CONFIG.skills);
        this.loadSkills();
    }

    loadHeroContent() {
        const saved = localStorage.getItem('hero_skills');
        if (saved) {
            this.heroContent = JSON.parse(saved);
        }
    }

    loadSkills() {
        this.contentService.getSkills().subscribe({
            next: (skills) => {
                this.skills.set(skills);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading skills:', error);
                this.loading.set(false);
            }
        });
    }

    setCategory(category: string) {
        this.activeCategory.set(category);
    }

    getProficiencyLevel(proficiency: number): string {
        if (proficiency >= 90) return 'Advanced';
        if (proficiency >= 70) return 'Proficient';
        if (proficiency >= 60) return 'Intermediate';
        return 'Beginner';
    }

    getProficiencyColor(proficiency: number): string {
        if (proficiency >= 90) return 'advanced';
        if (proficiency >= 70) return 'proficient';
        if (proficiency >= 60) return 'intermediate';
        return 'beginner';
    }

    getSkillIcon(category: string): string {
        const icons: { [key: string]: string } = {
            'Frontend': 'web',
            'Backend': 'dns',
            'DevOps': 'cloud',
            'Tools': 'build',
            'Database': 'storage'
        };
        return icons[category] || 'code';
    }
}
