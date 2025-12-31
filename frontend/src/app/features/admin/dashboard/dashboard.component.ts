import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser = signal<any>(null);
  profile = signal<any>(null);
  statistics = signal({
    projects: 0,
    skills: 0,
    blogs: 0,
    experience: 0
  });

  contentSections = [
    { title: 'Profile', icon: 'person', route: '/admin/profile', description: 'Update your personal information and bio' },
    { title: 'About', icon: 'info', route: '/admin/about', description: 'Manage About page content, milestones, and interests' },
    { title: 'Messages', icon: 'mail', route: '/admin/messages', description: 'View and manage contact form submissions' },
    { title: 'Skills', icon: 'code', route: '/admin/skills', description: 'Manage your technical skills and proficiency levels' },
    { title: 'Projects', icon: 'work', route: '/admin/projects', description: 'Showcase your portfolio projects' },
    { title: 'Experience', icon: 'business_center', route: '/admin/experience', description: 'Add and edit your work history' },
    { title: 'Blogs', icon: 'article', route: '/admin/blogs', description: 'Write and publish blog posts' },
    { title: 'Fun Facts', icon: 'star', route: '/admin/fun-facts', description: 'Share interesting facts about yourself' },
    { title: 'Contact', icon: 'contact_mail', route: '/admin/contact', description: 'Update contact information' },
    { title: 'Settings', icon: 'settings', route: '/admin/settings', description: 'Configure site settings' }
  ];

  constructor(
    private authService: AuthService,
    private contentService: ContentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load profile
    this.contentService.getProfile().subscribe({
      next: (profile: any) => {
        this.profile.set(profile);
      },
      error: (error: any) => console.error('Error loading profile:', error)
    });

    // Load statistics
    this.loadStatistics();
  }

  loadStatistics() {
    this.contentService.getAllProjects().subscribe({
      next: (projects: any) => {
        this.statistics.update(stats => ({ ...stats, projects: projects?.length || 0 }));
      },
      error: () => { }
    });

    this.contentService.getAllSkills().subscribe({
      next: (skills: any) => {
        this.statistics.update(stats => ({ ...stats, skills: skills?.length || 0 }));
      },
      error: () => { }
    });

    this.contentService.getAllBlogs().subscribe({
      next: (blogs: any) => {
        this.statistics.update(stats => ({ ...stats, blogs: blogs?.length || 0 }));
      },
      error: () => { }
    });

    this.contentService.getAllExperience().subscribe({
      next: (experience: any) => {
        this.statistics.update(stats => ({ ...stats, experience: experience?.length || 0 }));
      },
      error: () => { }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
