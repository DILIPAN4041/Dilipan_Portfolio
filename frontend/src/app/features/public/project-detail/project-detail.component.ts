import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project = signal<any>(null);
  relatedProjects = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProject(id);
    });
  }

  loadProject(id: string) {
    this.contentService.getProjectById(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loadRelatedProjects();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading.set(false);
      }
    });
  }

  loadRelatedProjects() {
    this.contentService.getProjects().subscribe({
      next: (projects) => {
        this.relatedProjects.set(projects.slice(0, 3));
      },
      error: (error) => console.error('Error loading related projects:', error)
    });
  }
}
