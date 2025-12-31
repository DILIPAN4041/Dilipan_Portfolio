import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentService } from '../../../services/content.service';
import { AiService } from '../../../services/ai.service';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-projects-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Projects</h1>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>{{ showAddForm ? 'close' : 'add' }}</mat-icon>
          {{ showAddForm ? 'Cancel' : 'New Project' }}
        </button>
      </div>

      <!-- Add/Edit Form -->
      <mat-card *ngIf="showAddForm || editingId()" class="form-card">
        <h2>{{ editingId() ? 'Edit Project' : 'New Project' }}</h2>
        <form [formGroup]="projectForm" (ngSubmit)="saveProject()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" required></textarea>
          </mat-form-field>
          <button mat-stroked-button type="button" class="ai-button" (click)="rephraseDescription()" [disabled]="aiLoading() || !projectForm.get('description')?.value">
            <mat-icon>auto_awesome</mat-icon>
            {{ aiLoading() ? 'Rephrasing...' : 'Rephrase with AI' }}
          </button>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tech Stack (comma separated)</mat-label>
            <input matInput formControlName="techStack" placeholder="React, Node.js, MongoDB">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Code URL (GitHub)</mat-label>
            <input matInput formControlName="codeUrl" type="url">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Demo URL</mat-label>
            <input matInput formControlName="demoUrl" type="url">
          </mat-form-field>

          <div class="image-upload-section">
            <label class="upload-label">Project Image</label>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              {{ selectedFile ? selectedFile.name : 'Choose Image' }}
            </button>
            <span *ngIf="selectedFile" class="file-info">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
          </div>

          <mat-checkbox formControlName="featured">Featured Project</mat-checkbox>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="projectForm.invalid || saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </mat-card>

      <!-- Projects List -->
      <mat-card class="table-card">
        <table mat-table [dataSource]="projects()" class="projects-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let project">{{ project.title }}</td>
          </ng-container>

          <ng-container matColumnDef="techStack">
            <th mat-header-cell *matHeaderCellDef>Tech Stack</th>
            <td mat-cell *matCellDef="let project">
              <span class="tech-badge" *ngFor="let tech of project.techStack?.slice(0, 3)">{{ tech }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="featured">
            <th mat-header-cell *matHeaderCellDef>Featured</th>
            <td mat-cell *matCellDef="let project">
              <mat-icon [class.featured]="project.featured">{{ project.featured ? 'star' : 'star_border' }}</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let project">
              <button mat-icon-button (click)="editProject(project)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProject(project._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="projects().length === 0" class="no-data">
          <mat-icon>folder_open</mat-icon>
          <p>No projects yet. Create your first project!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .form-card { margin-bottom: 2rem; padding: 1.5rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .table-card { padding: 1rem; }
    .projects-table { width: 100%; }
    .tech-badge { display: inline-block; padding: 0.25rem 0.5rem; margin-right: 0.5rem; background: #e0e7ff; border-radius: 4px; font-size: 0.75rem; }
    .featured { color: #f59e0b; }
    .no-data { text-align: center; padding: 3rem; color: #6b7280; }
    mat-icon { vertical-align: middle; }
    .ai-button { margin-bottom: 1rem; color: #8b5cf6; border-color: #8b5cf6; }
    .ai-button:hover { background: #f5f3ff; }
    .image-upload-section { margin-bottom: 1rem; }
    .upload-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
    .file-info { margin-left: 1rem; color: #6b7280; font-size: 0.875rem; }
  `]
})
export class ProjectsAdminComponent implements OnInit {
  projects = signal<Project[]>([]);
  projectForm: FormGroup;
  showAddForm = false;
  editingId = signal<string | null>(null);
  saving = signal(false);
  aiLoading = signal(false);
  selectedFile: File | null = null;
  displayedColumns = ['title', 'techStack', 'featured', 'actions'];

  constructor(
    private contentService: ContentService,
    private aiService: AiService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      techStack: [''],
      codeUrl: [''],
      demoUrl: [''],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.contentService.getProjects().subscribe({
      next: (projects: Project[]) => this.projects.set(projects),
      error: (error: Error) => console.error('Failed to load projects:', error)
    });
  }

  editProject(project: Project): void {
    this.editingId.set(project._id);
    this.showAddForm = true;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      techStack: project.techStack?.join(', ') || '',
      codeUrl: project.codeUrl || '',
      demoUrl: project.demoUrl || '',
      featured: project.featured || false
    });
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;

    this.saving.set(true);
    const formValue = this.projectForm.value;
    const projectData: Partial<Project> = {
      title: formValue.title,
      description: formValue.description,
      techStack: formValue.techStack ? formValue.techStack.split(',').map((t: string) => t.trim()) : [],
      codeUrl: formValue.codeUrl,
      demoUrl: formValue.demoUrl,
      featured: formValue.featured
    };

    const request = this.editingId()
      ? this.contentService.updateProject(this.editingId()!, projectData)
      : this.contentService.createProject(projectData);

    request.subscribe({
      next: () => {
        alert('Project saved successfully!');
        this.cancelEdit();
        this.loadProjects();
      },
      error: (error: Error) => {
        this.saving.set(false);
        alert('Failed to save project: ' + error.message);
      }
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.contentService.deleteProject(id).subscribe({
      next: () => {
        alert('Project deleted successfully');
        this.loadProjects();
      },
      error: (error: Error) => alert('Failed to delete project: ' + error.message)
    });
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingId.set(null);
    this.saving.set(false);
    this.selectedFile = null;
    this.projectForm.reset({ featured: false });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  rephraseDescription(): void {
    const description = this.projectForm.get('description')?.value;
    if (!description) return;

    this.aiLoading.set(true);
    this.aiService.rephrase(description).subscribe({
      next: (result) => {
        this.projectForm.patchValue({ description: result.suggestion });
        this.aiLoading.set(false);
        alert('Description rephrased successfully!');
      },
      error: (error) => {
        this.aiLoading.set(false);
        alert('Failed to rephrase: ' + (error.error?.message || error.message));
      }
    });
  }
}
