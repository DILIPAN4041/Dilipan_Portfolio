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
import { MatSliderModule } from '@angular/material/slider';
import { ContentService } from '../../../services/content.service';
import { Skill } from '../../../core/models';

@Component({
    selector: 'app-skills-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule],
    template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Skills</h1>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>{{ showAddForm ? 'close' : 'add' }}</mat-icon>
          {{ showAddForm ? 'Cancel' : 'New Skill' }}
        </button>
      </div>

      <mat-card *ngIf="showAddForm || editingId()" class="form-card">
        <h2>{{ editingId() ? 'Edit Skill' : 'New Skill' }}</h2>
        <form [formGroup]="skillForm" (ngSubmit)="saveSkill()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Skill Name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category" required>
              <mat-option value="Frontend">Frontend</mat-option>
              <mat-option value="Backend">Backend</mat-option>
              <mat-option value="Database">Database</mat-option>
              <mat-option value="DevOps">DevOps</mat-option>
              <mat-option value="Tools">Tools</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="proficiency-field">
            <label>Proficiency: {{ skillForm.get('proficiency')?.value }}%</label>
            <mat-slider min="0" max="100" step="5" showTickMarks discrete>
              <input matSliderThumb formControlName="proficiency">
            </mat-slider>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="skillForm.invalid || saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="skills()" class="skills-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Skill</th>
            <td mat-cell *matCellDef="let skill">{{ skill.name }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let skill">{{ skill.category }}</td>
          </ng-container>

          <ng-container matColumnDef="proficiency">
            <th mat-header-cell *matHeaderCellDef>Proficiency</th>
            <td mat-cell *matCellDef="let skill">
              <div class="proficiency-bar">
                <div class="proficiency-fill" [style.width.%]="skill.proficiency">{{ skill.proficiency }}%</div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let skill">
              <button mat-icon-button (click)="editSkill(skill)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteSkill(skill._id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="skills().length === 0" class="no-data">
          <mat-icon>code</mat-icon>
          <p>No skills yet. Add your first skill!</p>
        </div>
      </mat-card>
    </div>
  `,
    styles: [`
    .admin-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .form-card { margin-bottom: 2rem; padding: 1.5rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .proficiency-field { margin-bottom: 1.5rem; }
    .proficiency-field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
    .table-card { padding: 1rem; }
    .skills-table { width: 100%; }
    .proficiency-bar { background: #e5e7eb; border-radius: 4px; height: 24px; position: relative; overflow: hidden; }
    .proficiency-fill { background: #3b82f6; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 500; }
    .no-data { text-align: center; padding: 3rem; color: #6b7280; }
  `]
})
export class SkillsAdminComponent implements OnInit {
    skills = signal<Skill[]>([]);
    skillForm: FormGroup;
    showAddForm = false;
    editingId = signal<string | null>(null);
    saving = signal(false);
    displayedColumns = ['name', 'category', 'proficiency', 'actions'];

    constructor(private contentService: ContentService, private fb: FormBuilder) {
        this.skillForm = this.fb.group({
            name: ['', Validators.required],
            category: ['Frontend', Validators.required],
            proficiency: [50, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    ngOnInit(): void {
        this.loadSkills();
    }

    loadSkills(): void {
        this.contentService.getSkills().subscribe({
            next: (skills: Skill[]) => this.skills.set(skills),
            error: (error: Error) => console.error('Failed to load skills:', error)
        });
    }

    editSkill(skill: Skill): void {
        this.editingId.set(skill._id);
        this.showAddForm = true;
        this.skillForm.patchValue({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency
        });
    }

    saveSkill(): void {
        if (this.skillForm.invalid) return;

        this.saving.set(true);
        const skillData: Partial<Skill> = this.skillForm.value;

        const request = this.editingId()
            ? this.contentService.updateSkill(this.editingId()!, skillData)
            : this.contentService.createSkill(skillData);

        request.subscribe({
            next: () => {
                alert('Skill saved successfully!');
                this.cancelEdit();
                this.loadSkills();
            },
            error: (error: Error) => {
                this.saving.set(false);
                alert('Failed to save skill: ' + error.message);
            }
        });
    }

    deleteSkill(id: string): void {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        this.contentService.deleteSkill(id).subscribe({
            next: () => {
                alert('Skill deleted successfully');
                this.loadSkills();
            },
            error: (error: Error) => alert('Failed to delete skill: ' + error.message)
        });
    }

    cancelEdit(): void {
        this.showAddForm = false;
        this.editingId.set(null);
        this.saving.set(false);
        this.skillForm.reset({ category: 'Frontend', proficiency: 50 });
    }
}
