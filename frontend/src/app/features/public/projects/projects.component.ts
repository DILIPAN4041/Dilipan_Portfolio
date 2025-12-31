import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule],
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
    projects = signal<any[]>([]);
    loading = signal(true);
    searchQuery = signal('');
    selectedTech = signal('All');
    displayCount = signal(6);

    // Extract unique technologies from all projects
    allTechnologies = computed(() => {
        const techSet = new Set<string>();
        this.projects().forEach(project => {
            project.techStack?.forEach((tech: string) => techSet.add(tech));
        });
        return ['All', ...Array.from(techSet).sort()];
    });

    filteredProjects = computed(() => {
        let filtered = this.projects();

        // Filter by search query
        const query = this.searchQuery().toLowerCase();
        if (query) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query)
            );
        }

        // Filter by technology
        const tech = this.selectedTech();
        if (tech !== 'All') {
            filtered = filtered.filter(project =>
                project.techStack?.includes(tech)
            );
        }

        return filtered;
    });

    heroContent = {
        title: 'My Projects',
        description: 'Explore my portfolio of web applications, showcasing my expertise in full-stack development and creative problem-solving.'
    };

    displayedProjects = computed(() => {
        return this.filteredProjects().slice(0, this.displayCount());
    });

    hasMore = computed(() => {
        return this.filteredProjects().length > this.displayCount();
    });

    constructor(private contentService: ContentService, private meta: MetaService) { }

    ngOnInit() {
        this.loadHeroContent();
        this.meta.updateTags(SEO_CONFIG.projects);
        this.loadProjects();
    }

    loadHeroContent() {
        const saved = localStorage.getItem('hero_projects');
        if (saved) {
            this.heroContent = JSON.parse(saved);
        }
    }

    loadProjects() {
        this.contentService.getProjects().subscribe({
            next: (projects) => {
                this.projects.set(projects);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading projects:', error);
                this.loading.set(false);
            }
        });
    }

    selectTech(tech: string) {
        this.selectedTech.set(tech);
        this.displayCount.set(6); // Reset display count when filtering
    }

    loadMore() {
        this.displayCount.update(count => count + 6);
    }
}
