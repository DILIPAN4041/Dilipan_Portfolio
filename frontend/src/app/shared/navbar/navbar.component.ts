import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ContentService } from '../../services/content.service';
import { VisibilityService } from '../../services/visibility.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  mobileMenuOpen = signal(false);

  allNavLinks = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'About', key: 'about' },
    { path: '/skills', label: 'Skills', key: 'skills' },
    { path: '/projects', label: 'Projects', key: 'projects' },
    { path: '/experience', label: 'Experience', key: 'experience' },
    { path: '/blogs', label: 'Blogs', key: 'blogs' },
    { path: '/fun-facts', label: 'Fun Facts', key: 'funfacts' },
    { path: '/contact', label: 'Contact', key: 'contact' }
  ];

  // Computed property that filters links based on visibility from service
  navLinks = computed(() => {
    const visibility = this.visibilityService.visibility();
    return this.allNavLinks.filter(link => {
      if (link.key === 'home') return true; // Home is always visible
      return visibility[link.key as keyof typeof visibility] !== false;
    });
  });

  constructor(
    private router: Router,
    private contentService: ContentService,
    private visibilityService: VisibilityService
  ) { }

  ngOnInit() {
    this.loadVisibility();
  }

  loadVisibility() {
    // Load from service (which loads from localStorage)
    this.visibilityService.loadVisibility();

    // Also try to load from backend
    this.contentService.getSettings().subscribe({
      next: (settings: any) => {
        if (settings.sectionsVisibility) {
          this.visibilityService.updateVisibility(settings.sectionsVisibility);
        }
      },
      error: () => {
        // Already loaded from localStorage via service
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
