import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blogs = signal<any[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedTag = signal('All');

  allTags = computed(() => {
    const tagSet = new Set<string>();
    this.blogs().forEach(blog => {
      blog.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    return ['All', ...Array.from(tagSet).sort()];
  });

  featuredBlogs = computed(() => {
    return this.blogs().slice(0, 2);
  });

  filteredBlogs = computed(() => {
    let filtered = this.blogs();

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query)
      );
    }

    const tag = this.selectedTag();
    if (tag !== 'All') {
      filtered = filtered.filter(blog => blog.tags?.includes(tag));
    }

    return filtered;
  });

  heroContent = {
    title: 'Blog & Insights',
    description: 'Thoughts, tutorials, and insights on web development, technology trends, and software engineering best practices.'
  };

  constructor(private contentService: ContentService, private meta: MetaService) { }

  ngOnInit() {
    this.loadHeroContent();
    this.meta.updateTags(SEO_CONFIG.blogs);
    this.loadBlogs();
  }

  loadHeroContent() {
    const saved = localStorage.getItem('hero_blogs');
    if (saved) {
      this.heroContent = JSON.parse(saved);
    }
  }

  loadBlogs() {
    this.contentService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs.set(blogs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.loading.set(false);
      }
    });
  }

  selectTag(tag: string) {
    this.selectedTag.set(tag);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
