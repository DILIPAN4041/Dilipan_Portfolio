import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/experience', label: 'Experience' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/fun-facts', label: 'Fun Facts' },
    { path: '/contact', label: 'Contact' }
  ];

  socialLinks = [
    { icon: 'link', label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: 'code', label: 'GitHub', url: 'https://github.com' },
    { icon: 'chat', label: 'Twitter', url: 'https://twitter.com' },
    { icon: 'photo_camera', label: 'Instagram', url: 'https://instagram.com' }
  ];
}
