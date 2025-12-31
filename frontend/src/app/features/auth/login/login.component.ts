import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  identifier = signal('');
  password = signal('');
  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');
  sessionExpired = signal(false);
  returnUrl: string = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit(): void {
    // Check for session expiry and return URL from query params
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.sessionExpired.set(true);
        this.errorMessage.set('Your session has expired. Please login again.');
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  onSubmit(): void {
    if (!this.identifier() || !this.password()) {
      this.errorMessage.set('Please enter both email/userId and password');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.sessionExpired.set(false);

    this.authService.login(this.identifier(), this.password()).subscribe({
      next: () => {
        this.loading.set(false);
        // Routing is handled in AuthService
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }
}
