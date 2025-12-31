import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentService } from '../../../services/content.service';
import { Profile } from '../../../core/models';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Interest {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage About Section</h1>
      </div>

      <mat-tab-group>
        <!-- Profile Tab -->
        <mat-tab label="Profile Info">
          <mat-card class="tab-content">
            <h2>Basic Information</h2>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Role/Title</mat-label>
                <input matInput formControlName="role" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Bio</mat-label>
                <textarea matInput formControlName="bio" rows="6" required></textarea>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || savingProfile()">
                  <mat-icon>save</mat-icon>
                  {{ savingProfile() ? 'Saving...' : 'Save Profile' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>

        <!-- Philosophy Tab -->
        <mat-tab label="Philosophy">
          <mat-card class="tab-content">
            <h2>My Philosophy & Approach</h2>
            <form [formGroup]="philosophyForm" (ngSubmit)="savePhilosophy()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Paragraph 1</mat-label>
                <textarea matInput formControlName="paragraph1" rows="4" required></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Paragraph 2</mat-label>
                <textarea matInput formControlName="paragraph2" rows="4" required></textarea>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="philosophyForm.invalid || savingPhilosophy()">
                  <mat-icon>save</mat-icon>
                  {{ savingPhilosophy() ? 'Saving...' : 'Save Philosophy' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>

        <!-- Milestones Tab -->
        <mat-tab label="Milestones">
          <mat-card class="tab-content">
            <div class="section-header">
              <h2>Career Milestones</h2>
              <button mat-raised-button color="primary" (click)="addMilestone()">
                <mat-icon>add</mat-icon>
                Add Milestone
              </button>
            </div>

            <form [formGroup]="milestonesForm">
              <div formArrayName="milestones" class="items-list">
                <mat-card *ngFor="let milestone of milestones.controls; let i = index" [formGroupName]="i" class="item-card">
                  <div class="item-header">
                    <h3>Milestone {{ i + 1 }}</h3>
                    <button mat-icon-button color="warn" (click)="removeMilestone(i)" type="button">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Year</mat-label>
                    <input matInput formControlName="year" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Title</mat-label>
                    <input matInput formControlName="title" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="3" required></textarea>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Icon (Material Icon name)</mat-label>
                    <input matInput formControlName="icon" placeholder="rocket_launch">
                  </mat-form-field>
                </mat-card>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" (click)="saveMilestones()" [disabled]="milestonesForm.invalid || savingMilestones()">
                  <mat-icon>save</mat-icon>
                  {{ savingMilestones() ? 'Saving...' : 'Save Milestones' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>

        <!-- Interests Tab -->
        <mat-tab label="Interests">
          <mat-card class="tab-content">
            <div class="section-header">
              <h2>Personal Interests</h2>
              <button mat-raised-button color="primary" (click)="addInterest()">
                <mat-icon>add</mat-icon>
                Add Interest
              </button>
            </div>

            <form [formGroup]="interestsForm">
              <div formArrayName="interests" class="items-list">
                <mat-card *ngFor="let interest of interests.controls; let i = index" [formGroupName]="i" class="item-card">
                  <div class="item-header">
                    <h3>Interest {{ i + 1 }}</h3>
                    <button mat-icon-button color="warn" (click)="removeInterest(i)" type="button">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Icon (Material Icon name)</mat-label>
                    <input matInput formControlName="icon" placeholder="code" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Title</mat-label>
                    <input matInput formControlName="title" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="2" required></textarea>
                  </mat-form-field>
                </mat-card>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" (click)="saveInterests()" [disabled]="interestsForm.invalid || savingInterests()">
                  <mat-icon>save</mat-icon>
                  {{ savingInterests() ? 'Saving...' : 'Save Interests' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .header { margin-bottom: 2rem; }
    .tab-content { padding: 2rem; margin-top: 1rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 2rem; }
    .items-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
    .item-card { padding: 1.5rem; background: #f9fafb; }
    .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .item-header h3 { margin: 0; color: #374151; }
  `]
})
export class AboutAdminComponent implements OnInit {
  profileForm: FormGroup;
  philosophyForm: FormGroup;
  milestonesForm: FormGroup;
  interestsForm: FormGroup;

  savingProfile = signal(false);
  savingPhilosophy = signal(false);
  savingMilestones = signal(false);
  savingInterests = signal(false);

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
  ) {
    // Profile Form
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      bio: ['', Validators.required]
    });

    // Philosophy Form
    this.philosophyForm = this.fb.group({
      paragraph1: ['', Validators.required],
      paragraph2: ['', Validators.required]
    });

    // Milestones Form
    this.milestonesForm = this.fb.group({
      milestones: this.fb.array([])
    });

    // Interests Form
    this.interestsForm = this.fb.group({
      interests: this.fb.array([])
    });
  }

  get milestones(): FormArray {
    return this.milestonesForm.get('milestones') as FormArray;
  }

  get interests(): FormArray {
    return this.interestsForm.get('interests') as FormArray;
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadPhilosophy();
    this.loadMilestones();
    this.loadInterests();
  }

  loadProfile(): void {
    this.contentService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.profileForm.patchValue({
          name: profile.name,
          role: profile.role,
          bio: profile.bio
        });
      },
      error: (error: Error) => console.error('Failed to load profile:', error)
    });
  }

  loadPhilosophy(): void {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('about_philosophy');
    const defaultPhilosophy = saved ? JSON.parse(saved) : {
      paragraph1: 'I believe that great software is born from the perfect blend of technical excellence and creative problem-solving. My approach centers on understanding user needs deeply, crafting elegant solutions, and writing clean, maintainable code that stands the test of time.',
      paragraph2: "I'm passionate about creating robust, scalable, and intuitive applications that make a real difference. Every project is an opportunity to learn, grow, and push the boundaries of what's possible with modern web technologies."
    };

    this.philosophyForm.patchValue(defaultPhilosophy);
  }

  loadMilestones(): void {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('about_milestones');
    const defaultMilestones: Milestone[] = saved ? JSON.parse(saved) : [
      { year: '2020', title: 'Started Full-Stack Development Journey', description: 'Began learning web development with a focus on modern JavaScript frameworks and backend technologies.', icon: 'rocket_launch' },
      { year: '2021', title: 'First Professional Project', description: 'Delivered my first production-ready web application, gaining valuable real-world experience.', icon: 'work' },
      { year: '2022', title: 'Mastered Modern Tech Stack', description: 'Achieved proficiency in Angular, Node.js, MongoDB, and cloud deployment technologies.', icon: 'school' },
      { year: '2023', title: 'Led Development Team', description: 'Took on leadership role, mentoring junior developers and architecting complex systems.', icon: 'groups' }
    ];

    defaultMilestones.forEach((milestone: Milestone) => this.addMilestoneWithData(milestone));
  }

  loadInterests(): void {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('about_interests');
    const defaultInterests: Interest[] = saved ? JSON.parse(saved) : [
      { icon: 'code', title: 'Coding & Tech', description: 'Passionate about exploring new technologies and building innovative solutions' },
      { icon: 'palette', title: 'UI/UX Design', description: 'Creating beautiful, user-friendly interfaces that delight users' },
      { icon: 'book', title: 'Continuous Learning', description: 'Always expanding my knowledge through courses, books, and hands-on projects' },
      { icon: 'fitness_center', title: 'Fitness', description: 'Maintaining a healthy lifestyle through regular exercise and outdoor activities' }
    ];

    defaultInterests.forEach((interest: Interest) => this.addInterestWithData(interest));
  }

  addMilestone(): void {
    this.milestones.push(this.fb.group({
      year: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      icon: ['star']
    }));
  }

  addMilestoneWithData(milestone: Milestone): void {
    this.milestones.push(this.fb.group({
      year: [milestone.year, Validators.required],
      title: [milestone.title, Validators.required],
      description: [milestone.description, Validators.required],
      icon: [milestone.icon]
    }));
  }

  removeMilestone(index: number): void {
    if (confirm('Remove this milestone?')) {
      this.milestones.removeAt(index);
    }
  }

  addInterest(): void {
    this.interests.push(this.fb.group({
      icon: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  addInterestWithData(interest: Interest): void {
    this.interests.push(this.fb.group({
      icon: [interest.icon, Validators.required],
      title: [interest.title, Validators.required],
      description: [interest.description, Validators.required]
    }));
  }

  removeInterest(index: number): void {
    if (confirm('Remove this interest?')) {
      this.interests.removeAt(index);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.savingProfile.set(true);
    const profileData: Partial<Profile> = this.profileForm.value;

    this.contentService.updateProfile(profileData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.savingProfile.set(false);
      },
      error: (error: Error) => {
        this.savingProfile.set(false);
        alert('Failed to update profile: ' + error.message);
      }
    });
  }

  savePhilosophy(): void {
    if (this.philosophyForm.invalid) return;

    this.savingPhilosophy.set(true);
    const philosophyData = this.philosophyForm.value;

    // Save to localStorage (since there's no backend API for this)
    localStorage.setItem('about_philosophy', JSON.stringify(philosophyData));

    setTimeout(() => {
      alert('Philosophy saved successfully!');
      this.savingPhilosophy.set(false);
    }, 500);
  }

  saveMilestones(): void {
    if (this.milestonesForm.invalid) return;

    this.savingMilestones.set(true);
    const milestonesData = this.milestonesForm.value.milestones;

    // Save to localStorage (since there's no backend API for this)
    localStorage.setItem('about_milestones', JSON.stringify(milestonesData));

    setTimeout(() => {
      alert('Milestones saved successfully!');
      this.savingMilestones.set(false);
    }, 500);
  }

  saveInterests(): void {
    if (this.interestsForm.invalid) return;

    this.savingInterests.set(true);
    const interestsData = this.interestsForm.value.interests;

    // Save to localStorage (since there's no backend API for this)
    localStorage.setItem('about_interests', JSON.stringify(interestsData));

    setTimeout(() => {
      alert('Interests saved successfully!');
      this.savingInterests.set(false);
    }, 500);
  }
}
