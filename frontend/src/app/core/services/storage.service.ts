import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    // Get item from localStorage
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    }

    // Set item in localStorage
    setItem<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting item in storage:', error);
        }
    }

    // Remove item from localStorage
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from storage:', error);
        }
    }

    // Clear all localStorage
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    // Check if key exists
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
