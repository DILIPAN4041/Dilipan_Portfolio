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
import { Experience } from '../../../core/models';

@Component({
  selector: 'app-experience-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatProgressSpinnerModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Experience</h1>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>{{ showAddForm ? 'close' : 'add' }}</mat-icon>
          {{ showAddForm ? 'Cancel' : 'New Experience' }}
        </button>
      </div>

      <mat-card *ngIf="showAddForm || editingId()" class="form-card">
        <h2>{{ editingId() ? 'Edit Experience' : 'New Experience' }}</h2>
        <form [formGroup]="experienceForm" (ngSubmit)="saveExperience()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Company</mat-label>
            <input matInput formControlName="company" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role</mat-label>
            <input matInput formControlName="role" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" required></textarea>
          </mat-form-field>
          <button mat-stroked-button type="button" class="ai-button" (click)="rephraseDescription()" [disabled]="aiLoading() || !experienceForm.get('description')?.value">
            <mat-icon>auto_awesome</mat-icon>
            {{ aiLoading() ? 'Rephrasing...' : 'Rephrase with AI' }}
          </button>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Start Date</mat-label>
            <input matInput formControlName="startDate" type="date" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>End Date</mat-label>
            <input matInput formControlName="endDate" type="date">
          </mat-form-field>

          <mat-checkbox formControlName="current">Current Position</mat-checkbox>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="experienceForm.invalid || saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="experiences()" class="experience-table">
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let exp">{{ exp.company }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let exp">{{ exp.role }}</td>
          </ng-container>

          <ng-container matColumnDef="period">
            <th mat-header-cell *matHeaderCellDef>Period</th>
            <td mat-cell *matCellDef="let exp">
              {{ exp.startDate | date:'MMM yyyy' }} - {{ exp.current ? 'Present' : (exp.endDate | date:'MMM yyyy') }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let exp">
              <button mat-icon-button (click)="editExperience(exp)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteExperience(exp._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="experiences().length === 0" class="no-data">
          <mat-icon>work</mat-icon>
          <p>No experience yet. Add your first experience!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .form-card { margin-bottom: 2rem; padding: 1.5rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .table-card { padding: 1rem; }
    .experience-table { width: 100%; }
    .no-data { text-align: center; padding: 3rem; color: #6b7280; }
    .ai-button { margin-bottom: 1rem; color: #8b5cf6; border-color: #8b5cf6; }
    .ai-button:hover { background: #f5f3ff; }
  `]
})
export class ExperienceAdminComponent implements OnInit {
  experiences = signal<Experience[]>([]);
  experienceForm: FormGroup;
  showAddForm = false;
  editingId = signal<string | null>(null);
  saving = signal(false);
  aiLoading = signal(false);
  displayedColumns = ['company', 'role', 'period', 'actions'];

  constructor(
    private contentService: ContentService,
    private aiService: AiService,
    private fb: FormBuilder
  ) {
    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false]
    });
  }

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.contentService.getExperience().subscribe({
      next: (experiences: Experience[]) => this.experiences.set(experiences),
      error: (error: Error) => console.error('Failed to load experiences:', error)
    });
  }

  editExperience(experience: Experience): void {
    this.editingId.set(experience._id);
    this.showAddForm = true;
    this.experienceForm.patchValue({
      company: experience.company,
      role: experience.role,
      description: experience.description,
      startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
      current: experience.current || false
    });
  }

  saveExperience(): void {
    if (this.experienceForm.invalid) return;

    this.saving.set(true);
    const experienceData: Partial<Experience> = this.experienceForm.value;

    const request = this.editingId()
      ? this.contentService.updateExperience(this.editingId()!, experienceData)
      : this.contentService.createExperience(experienceData);

    request.subscribe({
      next: () => {
        alert('Experience saved successfully!');
        this.cancelEdit();
        this.loadExperiences();
      },
      error: (error: Error) => {
        this.saving.set(false);
        alert('Failed to save experience: ' + error.message);
      }
    });
  }

  deleteExperience(id: string): void {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    this.contentService.deleteExperience(id).subscribe({
      next: () => {
        alert('Experience deleted successfully');
        this.loadExperiences();
      },
      error: (error: Error) => alert('Failed to delete experience: ' + error.message)
    });
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingId.set(null);
    this.saving.set(false);
    this.experienceForm.reset({ current: false });
  }

  rephraseDescription(): void {
    const description = this.experienceForm.get('description')?.value;
    if (!description) return;

    this.aiLoading.set(true);
    this.aiService.rephrase(description).subscribe({
      next: (result) => {
        this.experienceForm.patchValue({ description: result.suggestion });
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
