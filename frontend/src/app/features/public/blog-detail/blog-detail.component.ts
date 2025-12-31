import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog = signal<any>(null);
  relatedBlogs = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadBlog(slug);
    });
  }

  loadBlog(slug: string) {
    this.contentService.getBlogBySlug(slug).subscribe({
      next: (blog) => {
        this.blog.set(blog);
        this.loadRelatedBlogs();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.loading.set(false);
      }
    });
  }

  loadRelatedBlogs() {
    this.contentService.getBlogs().subscribe({
      next: (blogs) => {
        this.relatedBlogs.set(blogs.slice(0, 3));
      },
      error: (error) => console.error('Error loading related blogs:', error)
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
