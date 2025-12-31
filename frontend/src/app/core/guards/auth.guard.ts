import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // Check if user must change password
        if (authService.mustChangePassword() && state.url !== '/change-password') {
            router.navigate(['/change-password']);
            return false;
        }
        return true;
    }

    // Not authenticated, redirect to login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
