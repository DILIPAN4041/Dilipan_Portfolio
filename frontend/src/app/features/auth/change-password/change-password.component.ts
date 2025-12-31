import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validation
    if (!this.currentPassword() || !this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set('All fields are required');
      return;
    }

    if (this.newPassword().length < 8) {
      this.errorMessage.set('New password must be at least 8 characters long');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('New passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(this.newPassword())) {
      this.errorMessage.set('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    this.loading.set(true);

    this.authService.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Password changed successfully! Redirecting...');
        // Routing is handled in AuthService
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Failed to change password');
      }
    });
  }
}
