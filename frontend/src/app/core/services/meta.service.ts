import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface MetaTags {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MetaService {
    private defaultTitle = 'Dilipan Portfolio | Full-Stack Developer';
    private defaultDescription = 'Explore my portfolio showcasing innovative web development projects, technical skills, and professional experience in modern technologies like Angular, Node.js, and MongoDB.';
    private defaultImage = '/assets/images/og-image.jpg';
    private defaultKeywords = 'web development, full-stack developer, Angular, Node.js, MongoDB, TypeScript, portfolio, software engineer';

    constructor(
        private meta: Meta,
        private title: Title
    ) { }

    updateTags(tags: MetaTags) {
        // Update title
        const pageTitle = tags.title ? `${tags.title} | Dilipan Portfolio` : this.defaultTitle;
        this.title.setTitle(pageTitle);

        // Update meta tags
        this.meta.updateTag({ name: 'description', content: tags.description || this.defaultDescription });
        this.meta.updateTag({ name: 'keywords', content: tags.keywords || this.defaultKeywords });
        this.meta.updateTag({ name: 'author', content: tags.author || 'Dilipan' });

        // Open Graph tags
        this.meta.updateTag({ property: 'og:title', content: pageTitle });
        this.meta.updateTag({ property: 'og:description', content: tags.description || this.defaultDescription });
        this.meta.updateTag({ property: 'og:image', content: tags.image || this.defaultImage });
        this.meta.updateTag({ property: 'og:url', content: tags.url || window.location.href });
        this.meta.updateTag({ property: 'og:type', content: tags.type || 'website' });

        // Twitter Card tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
        this.meta.updateTag({ name: 'twitter:description', content: tags.description || this.defaultDescription });
        this.meta.updateTag({ name: 'twitter:image', content: tags.image || this.defaultImage });

        // Canonical URL
        this.updateCanonicalUrl(tags.url || window.location.href);
    }

    updateCanonicalUrl(url: string) {
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }

    resetToDefaults() {
        this.updateTags({
            title: undefined,
            description: undefined
        });
    }
}
