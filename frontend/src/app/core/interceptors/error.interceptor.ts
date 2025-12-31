import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const storage = inject(StorageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'Unable to connect to server. Please check your internet connection.';
                        break;
                    case 400:
                        errorMessage = error.error?.message || 'Bad request';
                        break;
                    case 401:
                        // Unauthorized - Token expired or invalid
                        errorMessage = error.error?.message || 'Session expired. Please login again.';

                        // Clear auth data and redirect to login
                        storage.removeItem('auth_token');
                        storage.removeItem('current_user');

                        // Only redirect if not already on login page
                        if (!router.url.includes('/login')) {
                            router.navigate(['/login'], {
                                queryParams: {
                                    returnUrl: router.url,
                                    sessionExpired: 'true'
                                }
                            });
                        }
                        break;
                    case 403:
                        errorMessage = error.error?.message || 'Access forbidden';
                        break;
                    case 404:
                        errorMessage = error.error?.message || 'Resource not found';
                        break;
                    case 500:
                        errorMessage = 'Internal server error. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error: ${error.status}`;
                }
            }

            console.error('HTTP Error:', errorMessage);
            return throwError(() => new Error(errorMessage));
        })
    );
};
