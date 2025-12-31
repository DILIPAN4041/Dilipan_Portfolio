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
import { Blog } from '../../../core/models';

@Component({
  selector: 'app-blogs-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Blogs</h1>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>{{ showAddForm ? 'close' : 'add' }}</mat-icon>
          {{ showAddForm ? 'Cancel' : 'New Blog' }}
        </button>
      </div>

      <mat-card *ngIf="showAddForm || editingId()" class="form-card">
        <h2>{{ editingId() ? 'Edit Blog' : 'New Blog' }}</h2>
        <form [formGroup]="blogForm" (ngSubmit)="saveBlog()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Excerpt</mat-label>
            <textarea matInput formControlName="excerpt" rows="2"></textarea>
          </mat-form-field>
          <button mat-stroked-button type="button" class="ai-button" (click)="rephraseExcerpt()" [disabled]="aiLoading() || !blogForm.get('excerpt')?.value">
            <mat-icon>auto_awesome</mat-icon>
            {{ aiLoading() ? 'Rephrasing...' : 'Rephrase Excerpt' }}
          </button>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Content</mat-label>
            <textarea matInput formControlName="content" rows="8" required></textarea>
          </mat-form-field>
          <button mat-stroked-button type="button" class="ai-button" (click)="rephraseContent()" [disabled]="aiLoading() || !blogForm.get('content')?.value">
            <mat-icon>auto_awesome</mat-icon>
            {{ aiLoading() ? 'Rephrasing...' : 'Rephrase Content' }}
          </button>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tags (comma separated)</mat-label>
            <input matInput formControlName="tags" placeholder="JavaScript, Angular, Web Development">
          </mat-form-field>

          <div class="image-upload-section">
            <label class="upload-label">Cover Image</label>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              {{ selectedFile ? selectedFile.name : 'Choose Image' }}
            </button>
            <span *ngIf="selectedFile" class="file-info">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
          </div>

          <mat-checkbox formControlName="published">Published</mat-checkbox>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="blogForm.invalid || saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="blogs()" class="blogs-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let blog">{{ blog.title }}</td>
          </ng-container>

          <ng-container matColumnDef="published">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let blog">
              <span [class]="blog.published ? 'status-published' : 'status-draft'">
                {{ blog.published ? 'Published' : 'Draft' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let blog">{{ blog.createdAt | date:'short' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let blog">
              <button mat-icon-button (click)="editBlog(blog)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteBlog(blog._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="blogs().length === 0" class="no-data">
          <mat-icon>article</mat-icon>
          <p>No blogs yet. Create your first blog post!</p>
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
    .blogs-table { width: 100%; }
    .status-published { color: #10b981; font-weight: 500; }
    .status-draft { color: #6b7280; }
    .no-data { text-align: center; padding: 3rem; color: #6b7280; }
    .ai-button { margin-bottom: 1rem; color: #8b5cf6; border-color: #8b5cf6; }
    .ai-button:hover { background: #f5f3ff; }
    .image-upload-section { margin-bottom: 1rem; }
    .upload-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
    .file-info { margin-left: 1rem; color: #6b7280; font-size: 0.875rem; }
  `]
})
export class BlogsAdminComponent implements OnInit {
  blogs = signal<Blog[]>([]);
  blogForm: FormGroup;
  showAddForm = false;
  editingId = signal<string | null>(null);
  saving = signal(false);
  aiLoading = signal(false);
  selectedFile: File | null = null;
  displayedColumns = ['title', 'published', 'date', 'actions'];

  constructor(
    private contentService: ContentService,
    private aiService: AiService,
    private fb: FormBuilder
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: [''],
      content: ['', Validators.required],
      tags: [''],
      published: [false]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.contentService.getBlogs().subscribe({
      next: (blogs: Blog[]) => this.blogs.set(blogs),
      error: (error: Error) => console.error('Failed to load blogs:', error)
    });
  }

  editBlog(blog: Blog): void {
    this.editingId.set(blog._id);
    this.showAddForm = true;
    this.blogForm.patchValue({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      tags: blog.tags?.join(', ') || '',
      published: blog.published || false
    });
  }

  saveBlog(): void {
    if (this.blogForm.invalid) return;

    this.saving.set(true);
    const formValue = this.blogForm.value;
    const blogData: Partial<Blog> = {
      title: formValue.title,
      excerpt: formValue.excerpt,
      content: formValue.content,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [],
      published: formValue.published
    };

    const request = this.editingId()
      ? this.contentService.updateBlog(this.editingId()!, blogData)
      : this.contentService.createBlog(blogData);

    request.subscribe({
      next: () => {
        alert('Blog saved successfully!');
        this.cancelEdit();
        this.loadBlogs();
      },
      error: (error: Error) => {
        this.saving.set(false);
        alert('Failed to save blog: ' + error.message);
      }
    });
  }

  deleteBlog(id: string): void {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    this.contentService.deleteBlog(id).subscribe({
      next: () => {
        alert('Blog deleted successfully');
        this.loadBlogs();
      },
      error: (error: Error) => alert('Failed to delete blog: ' + error.message)
    });
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingId.set(null);
    this.saving.set(false);
    this.selectedFile = null;
    this.blogForm.reset({ published: false });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  rephraseExcerpt(): void {
    const excerpt = this.blogForm.get('excerpt')?.value;
    if (!excerpt) return;

    this.aiLoading.set(true);
    this.aiService.rephrase(excerpt).subscribe({
      next: (result) => {
        this.blogForm.patchValue({ excerpt: result.suggestion });
        this.aiLoading.set(false);
        alert('Excerpt rephrased successfully!');
      },
      error: (error) => {
        this.aiLoading.set(false);
        alert('Failed to rephrase: ' + (error.error?.message || error.message));
      }
    });
  }

  rephraseContent(): void {
    const content = this.blogForm.get('content')?.value;
    if (!content) return;

    this.aiLoading.set(true);
    this.aiService.rephrase(content).subscribe({
      next: (result) => {
        this.blogForm.patchValue({ content: result.suggestion });
        this.aiLoading.set(false);
        alert('Content rephrased successfully!');
      },
      error: (error) => {
        this.aiLoading.set(false);
        alert('Failed to rephrase: ' + (error.error?.message || error.message));
      }
    });
  }
}
