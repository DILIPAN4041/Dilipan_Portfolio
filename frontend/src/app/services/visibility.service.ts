import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VisibilityService {
    // Use WritableSignal and expose it directly
    visibility: WritableSignal<{
        about: boolean;
        skills: boolean;
        projects: boolean;
        experience: boolean;
        blogs: boolean;
        funfacts: boolean;
        contact: boolean;
    }> = signal({
        about: true,
        skills: true,
        projects: true,
        experience: true,
        blogs: true,
        funfacts: true,
        contact: true
    });

    updateVisibility(newVisibility: any) {
        this.visibility.set({ ...newVisibility });
        localStorage.setItem('sections_visibility', JSON.stringify(newVisibility));
    }

    loadVisibility() {
        const saved = localStorage.getItem('sections_visibility');
        if (saved) {
            this.visibility.set(JSON.parse(saved));
        }
    }
}
