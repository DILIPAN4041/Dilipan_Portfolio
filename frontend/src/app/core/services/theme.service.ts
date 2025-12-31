import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'portfolio_theme';

    // Signal for reactive theme state
    currentTheme = signal<Theme>(this.getInitialTheme());

    constructor(private storage: StorageService) {
        // Apply theme whenever it changes
        effect(() => {
            this.applyTheme(this.currentTheme());
        });

        // Apply initial theme
        this.applyTheme(this.currentTheme());
    }

    private getInitialTheme(): Theme {
        // Check localStorage first
        const savedTheme = this.storage.getItem<Theme>(this.THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'dark'; // default to dark
    }

    private applyTheme(theme: Theme): void {
        const htmlElement = document.documentElement;

        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }

        // Save to localStorage
        this.storage.setItem(this.THEME_KEY, theme);
    }

    toggleTheme(): void {
        const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.currentTheme.set(newTheme);
    }

    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
    }

    isDark(): boolean {
        return this.currentTheme() === 'dark';
    }
}
