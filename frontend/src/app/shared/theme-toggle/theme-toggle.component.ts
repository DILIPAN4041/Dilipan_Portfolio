import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [matTooltip]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      class="theme-toggle-btn"
    >
      <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      transition: all 0.3s ease;
    }
    
    .theme-toggle-btn:hover {
      transform: rotate(180deg);
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) { }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDark(): boolean {
    return this.themeService.isDark();
  }
}
