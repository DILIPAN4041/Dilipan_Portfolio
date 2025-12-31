import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { VisibilityService } from '../../services/visibility.service';

export const visibilityGuard = (section: string) => {
    return () => {
        const router = inject(Router);
        const visibilityService = inject(VisibilityService);

        // Get current visibility from the service (reactive)
        const visibility = visibilityService.visibility();

        // Check if section is visible
        if (visibility[section as keyof typeof visibility] === false) {
            router.navigate(['/']);
            return false;
        }

        return true;
    };
};
