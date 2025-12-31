import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, LoginRequest, LoginResponse, ChangePasswordRequest, ApiResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    isAuthenticated = signal<boolean>(this.hasToken());

    constructor(
        private api: ApiService,
        private storage: StorageService,
        private router: Router
    ) { }

    // Login
    login(identifier: string, password: string): Observable<LoginResponse> {
        const request: LoginRequest = { identifier, password };

        return this.api.post<LoginResponse>('auth/login', request).pipe(
            map(response => response.data!),
            tap(data => {
                this.storage.setItem(this.TOKEN_KEY, data.token);
                this.isAuthenticated.set(true);

                // If must change password, redirect to change password page
                if (data.user.mustChangePassword) {
                    this.router.navigate(['/change-password']);
                } else {
                    this.fetchCurrentUser();
                    this.router.navigate(['/admin']);
                }
            })
        );
    }

    // Logout
    logout(): void {
        this.api.post('auth/logout', {}).subscribe({
            next: () => {
                this.clearAuthData();
                this.router.navigate(['/login']);
            },
            error: () => {
                // Even if API call fails, clear local data
                this.clearAuthData();
                this.router.navigate(['/login']);
            }
        });
    }

    // Change password
    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        const request: ChangePasswordRequest = { currentPassword, newPassword };

        return this.api.post('auth/change-password', request).pipe(
            tap(() => {
                this.fetchCurrentUser();
                this.router.navigate(['/admin']);
            })
        );
    }

    // Get current user from API
    fetchCurrentUser(): void {
        this.api.get<User>('auth/me').subscribe({
            next: (response) => {
                const user = response.data!;
                this.storage.setItem(this.USER_KEY, user);
                this.currentUserSubject.next(user);
            },
            error: (error) => {
                console.error('Error fetching current user:', error);
                this.clearAuthData();
            }
        });
    }

    // Get token
    getToken(): string | null {
        return this.storage.getItem<string>(this.TOKEN_KEY);
    }

    // Check if user has token
    private hasToken(): boolean {
        return this.storage.hasItem(this.TOKEN_KEY);
    }

    // Get current user from storage
    private getCurrentUserFromStorage(): User | null {
        return this.storage.getItem<User>(this.USER_KEY);
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Clear auth data
    private clearAuthData(): void {
        this.storage.removeItem(this.TOKEN_KEY);
        this.storage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticated.set(false);
    }

    // Check if must change password
    mustChangePassword(): boolean {
        const user = this.getCurrentUser();
        return user?.mustChangePassword || false;
    }
}
