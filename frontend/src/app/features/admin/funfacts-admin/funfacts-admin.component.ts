import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentService } from '../../../services/content.service';
import { AiService } from '../../../services/ai.service';
import { FunFact } from '../../../core/models';

@Component({
  selector: 'app-funfacts-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Fun Facts</h1>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>{{ showAddForm ? 'close' : 'add' }}</mat-icon>
          {{ showAddForm ? 'Cancel' : 'New Fun Fact' }}
        </button>
      </div>

      <mat-card *ngIf="showAddForm || editingId()" class="form-card">
        <h2>{{ editingId() ? 'Edit Fun Fact' : 'New Fun Fact' }}</h2>
        <form [formGroup]="funFactForm" (ngSubmit)="saveFunFact()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" required></textarea>
          </mat-form-field>
          <button mat-stroked-button type="button" class="ai-button" (click)="rephraseDescription()" [disabled]="aiLoading() || !funFactForm.get('description')?.value">
            <mat-icon>auto_awesome</mat-icon>
            {{ aiLoading() ? 'Rephrasing...' : 'Rephrase with AI' }}
          </button>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Icon (Material Icon name)</mat-label>
            <input matInput formControlName="icon" placeholder="emoji_events">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category" required>
              <mat-option value="Achievement">Achievement</mat-option>
              <mat-option value="Hobby">Hobby</mat-option>
              <mat-option value="Fact">Fact</mat-option>
              <mat-option value="Quote">Quote</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="funFactForm.invalid || saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="funFacts()" class="funfacts-table">
          <ng-container matColumnDef="icon">
            <th mat-header-cell *matHeaderCellDef>Icon</th>
            <td mat-cell *matCellDef="let fact">
              <mat-icon>{{ fact.icon }}</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let fact">{{ fact.title }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let fact">{{ fact.category }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let fact">
              <button mat-icon-button (click)="editFunFact(fact)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteFunFact(fact._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="funFacts().length === 0" class="no-data">
          <mat-icon>sentiment_satisfied</mat-icon>
          <p>No fun facts yet. Add your first fun fact!</p>
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
    .funfacts-table { width: 100%; }
    .no-data { text-align: center; padding: 3rem; color: #6b7280; }
    .ai-button { margin-bottom: 1rem; color: #8b5cf6; border-color: #8b5cf6; }
    .ai-button:hover { background: #f5f3ff; }
  `]
})
export class FunFactsAdminComponent implements OnInit {
  funFacts = signal<FunFact[]>([]);
  funFactForm: FormGroup;
  showAddForm = false;
  editingId = signal<string | null>(null);
  saving = signal(false);
  aiLoading = signal(false);
  displayedColumns = ['icon', 'title', 'category', 'actions'];

  constructor(
    private contentService: ContentService,
    private aiService: AiService,
    private fb: FormBuilder
  ) {
    this.funFactForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      icon: ['star'],
      category: ['Fact', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFunFacts();
  }

  loadFunFacts(): void {
    this.contentService.getFunFacts().subscribe({
      next: (funFacts: FunFact[]) => this.funFacts.set(funFacts),
      error: (error: Error) => console.error('Failed to load fun facts:', error)
    });
  }

  editFunFact(funFact: FunFact): void {
    this.editingId.set(funFact._id);
    this.showAddForm = true;
    this.funFactForm.patchValue({
      title: funFact.title,
      description: funFact.description,
      icon: funFact.icon,
      category: funFact.category
    });
  }

  saveFunFact(): void {
    if (this.funFactForm.invalid) return;

    this.saving.set(true);
    const funFactData: Partial<FunFact> = this.funFactForm.value;

    const request = this.editingId()
      ? this.contentService.updateFunFact(this.editingId()!, funFactData)
      : this.contentService.createFunFact(funFactData);

    request.subscribe({
      next: () => {
        alert('Fun fact saved successfully!');
        this.cancelEdit();
        this.loadFunFacts();
      },
      error: (error: Error) => {
        this.saving.set(false);
        alert('Failed to save fun fact: ' + error.message);
      }
    });
  }

  deleteFunFact(id: string): void {
    if (!confirm('Are you sure you want to delete this fun fact?')) return;

    this.contentService.deleteFunFact(id).subscribe({
      next: () => {
        alert('Fun fact deleted successfully');
        this.loadFunFacts();
      },
      error: (error: Error) => alert('Failed to delete fun fact: ' + error.message)
    });
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingId.set(null);
    this.saving.set(false);
    this.funFactForm.reset({ icon: 'star', category: 'Fact' });
  }

  rephraseDescription(): void {
    const description = this.funFactForm.get('description')?.value;
    if (!description) return;

    this.aiLoading.set(true);
    this.aiService.rephrase(description).subscribe({
      next: (result) => {
        this.funFactForm.patchValue({ description: result.suggestion });
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
