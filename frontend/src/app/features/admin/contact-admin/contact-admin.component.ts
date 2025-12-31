import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../../services/content.service';
import { Contact } from '../../../core/models';

@Component({
    selector: 'app-contact-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    template: `
    <div class="admin-container">
      <div class="header">
        <h1>Manage Contact Information</h1>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="contactForm" (ngSubmit)="saveContact()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" type="tel">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>
          </div>

          <h3>Social Links</h3>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>LinkedIn</mat-label>
            <input matInput formControlName="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile">
            <mat-icon matPrefix>link</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>GitHub</mat-label>
            <input matInput formControlName="github" type="url" placeholder="https://github.com/yourusername">
            <mat-icon matPrefix>link</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Twitter</mat-label>
            <input matInput formControlName="twitter" type="url" placeholder="https://twitter.com/yourusername">
            <mat-icon matPrefix>link</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Instagram</mat-label>
            <input matInput formControlName="instagram" type="url" placeholder="https://instagram.com/yourusername">
            <mat-icon matPrefix>link</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Website</mat-label>
            <input matInput formControlName="website" type="url" placeholder="https://yourwebsite.com">
            <mat-icon matPrefix>language</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address</mat-label>
            <textarea matInput formControlName="address" rows="2" placeholder="City, State, Country"></textarea>
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid || saving()">
              <mat-icon>save</mat-icon>
              {{ saving() ? 'Saving...' : 'Save Contact Info' }}
            </button>
          </div>
        </form>
      </mat-card>

      <div *ngIf="loading()" class="loading">
        <p>Loading contact information...</p>
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
    h3 { margin: 1.5rem 0 1rem; color: #374151; font-size: 1.1rem; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 2rem; }
    .loading { text-align: center; padding: 2rem; color: #6b7280; }
    mat-icon[matPrefix] { margin-right: 0.5rem; color: #6b7280; }
  `]
})
export class ContactAdminComponent implements OnInit {
    contactForm: FormGroup;
    loading = signal(true);
    saving = signal(false);

    constructor(private contentService: ContentService, private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            linkedin: [''],
            github: [''],
            twitter: [''],
            instagram: [''],
            website: [''],
            address: ['']
        });
    }

    ngOnInit(): void {
        this.loadContact();
    }

    loadContact(): void {
        this.contentService.getContact().subscribe({
            next: (contact: Contact) => {
                this.contactForm.patchValue({
                    email: contact.email,
                    phone: contact.phone || '',
                    linkedin: contact.linkedin || '',
                    github: contact.github || '',
                    twitter: contact.twitter || '',
                    instagram: contact.instagram || '',
                    website: contact.website || '',
                    address: contact.address || ''
                });
                this.loading.set(false);
            },
            error: (error: Error) => {
                console.error('Failed to load contact:', error);
                this.loading.set(false);
            }
        });
    }

    saveContact(): void {
        if (this.contactForm.invalid) return;

        this.saving.set(true);
        const contactData: Partial<Contact> = this.contactForm.value;

        this.contentService.updateContact(contactData).subscribe({
            next: () => {
                alert('Contact information updated successfully!');
                this.saving.set(false);
            },
            error: (error: Error) => {
                this.saving.set(false);
                alert('Failed to update contact: ' + error.message);
            }
        });
    }
}
