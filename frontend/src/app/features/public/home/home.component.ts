import { Component, OnInit, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('heroTitle', { static: false }) heroTitleRef?: ElementRef;

  profile = signal<any>(null);
  featuredProjects = signal<any[]>([]);
  loading = signal(true);
  typedText = signal('');
  showCursor = signal(true);

  heroContent = {
    title: 'Crafting Digital Experiences, <span class="gradient-text-animated">One Line of Code at a Time.</span>',
    description: "Hi, I'm {name}. A passionate {role} blending technical expertise with creative problem-solving to build impactful web applications."
  };

  private fullText = '';
  private typingSpeed = 50; // milliseconds per character

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.loadHeroContent();
    this.loadContent();
  }

  ngAfterViewInit() {
    // Start typing animation after view is initialized
    setTimeout(() => this.startTypingAnimation(), 500);
  }

  loadHeroContent() {
    const saved = localStorage.getItem('hero_home');
    if (saved) {
      this.heroContent = JSON.parse(saved);
    }
  }

  startTypingAnimation() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    // Extract text content (without HTML tags for typing)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.heroContent.title;
    this.fullText = tempDiv.textContent || tempDiv.innerText || '';

    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex < this.fullText.length) {
        this.typedText.set(this.fullText.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, this.typingSpeed);
      } else {
        // Typing complete, hide cursor after a delay
        setTimeout(() => this.showCursor.set(false), 1000);
      }
    };

    typeNextChar();
  }

  async loadContent() {
    try {
      // Load profile
      this.contentService.getProfile().subscribe({
        next: (profile) => {
          this.profile.set(profile);
        },
        error: (error) => console.error('Error loading profile:', error)
      });

      // Load featured projects
      this.contentService.getProjects().subscribe({
        next: (projects) => {
          this.featuredProjects.set(projects.slice(0, 3));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.loading.set(false);
        }
      });
    } catch (error) {
      console.error('Error loading content:', error);
      this.loading.set(false);
    }
  }
}
