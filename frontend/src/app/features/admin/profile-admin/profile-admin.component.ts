import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../../services/content.service';
import { Profile } from '../../../core/models';

@Component({
    selector: 'app-profile-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Profile</h1>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Role/Title</mat-label>
              <input matInput formControlName="role" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tagline</mat-label>
            <input matInput formControlName="tagline" placeholder="Full Stack Developer | Tech Enthusiast">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="San Francisco, CA">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Bio</mat-label>
            <textarea matInput formControlName="bio" rows="5" required></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Avatar URL</mat-label>
              <input matInput formControlName="avatarUrl" type="url">
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Resume URL</mat-label>
              <input matInput formControlName="resumeUrl" type="url">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Years of Experience</mat-label>
            <input matInput formControlName="yearsOfExperience" type="number" min="0">
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || saving()">
              <mat-icon>save</mat-icon>
              {{ saving() ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </form>
      </mat-card>

      <div *ngIf="loading()" class="loading">
        <p>Loading profile...</p>
      </div>
    </div>
  `,
    styles: [`
    .admin-container { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .form-card { padding: 2rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .half-width { flex: 1; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 2rem; }
    .loading { text-align: center; padding: 2rem; color: #6b7280; }
  `]
})
export class ProfileAdminComponent implements OnInit {
    profileForm: FormGroup;
    loading = signal(true);
    saving = signal(false);

    constructor(private contentService: ContentService, private fb: FormBuilder) {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            role: ['', Validators.required],
            tagline: [''],
            location: [''],
            bio: ['', Validators.required],
            avatarUrl: [''],
            resumeUrl: [''],
            yearsOfExperience: [0]
        });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.contentService.getProfile().subscribe({
            next: (profile: Profile) => {
                this.profileForm.patchValue({
                    name: profile.name,
                    role: profile.role,
                    tagline: profile.tagline || '',
                    location: profile.location,
                    bio: profile.bio,
                    avatarUrl: profile.avatarUrl,
                    resumeUrl: profile.resumeUrl,
                    yearsOfExperience: profile.yearsOfExperience || 0
                });
                this.loading.set(false);
            },
            error: (error: Error) => {
                console.error('Failed to load profile:', error);
                this.loading.set(false);
            }
        });
    }

    saveProfile(): void {
        if (this.profileForm.invalid) return;

        this.saving.set(true);
        const profileData: Partial<Profile> = this.profileForm.value;

        this.contentService.updateProfile(profileData).subscribe({
            next: () => {
                alert('Profile updated successfully!');
                this.saving.set(false);
            },
            error: (error: Error) => {
                this.saving.set(false);
                alert('Failed to update profile: ' + error.message);
            }
        });
    }
}
