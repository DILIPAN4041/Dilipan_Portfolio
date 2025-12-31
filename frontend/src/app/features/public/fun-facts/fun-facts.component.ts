import { Component, OnInit, signal, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
  selector: 'app-fun-facts',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './fun-facts.component.html',
  styleUrls: ['./fun-facts.component.scss']
})
export class FunFactsComponent implements OnInit, AfterViewInit {
  @ViewChildren('counter') counters!: QueryList<ElementRef>;

  funFacts = signal<any[]>([]);
  loading = signal(true);

  statistics = [
    { icon: 'code', label: 'Projects Completed', value: 50, suffix: '+' },
    { icon: 'emoji_events', label: 'Awards Won', value: 10, suffix: '+' },
    { icon: 'coffee', label: 'Cups of Coffee', value: 1000, suffix: '+' },
    { icon: 'schedule', label: 'Hours Coded', value: 5000, suffix: '+' }
  ];

  heroContent = {
    title: 'Fun Facts About Me',
    description: 'Beyond the code - interesting tidbits and personal highlights that make me who I am.'
  };

  constructor(private contentService: ContentService, private meta: MetaService) { }

  ngOnInit() {
    this.loadHeroContent();
    this.meta.updateTags(SEO_CONFIG.funFacts);
    this.loadFunFacts();
  }

  loadHeroContent() {
    const saved = localStorage.getItem('hero_funfacts');
    if (saved) {
      this.heroContent = JSON.parse(saved);
    }
  }

  ngAfterViewInit() {
    this.animateCounters();
  }

  loadFunFacts() {
    this.contentService.getFunFacts().subscribe({
      next: (funFacts) => {
        this.funFacts.set(funFacts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading fun facts:', error);
        this.loading.set(false);
      }
    });
  }

  animateCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const target = parseInt(element.getAttribute('data-target') || '0');
          this.animateValue(element, 0, target, 2000);
          observer.unobserve(element);
        }
      });
    });

    this.counters.forEach(counter => {
      observer.observe(counter.nativeElement);
    });
  }

  animateValue(element: HTMLElement, start: number, end: number, duration: number) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = current.toString();
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
