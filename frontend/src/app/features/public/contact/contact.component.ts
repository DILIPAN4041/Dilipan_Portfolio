import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentService } from '../../../services/content.service';
import { MetaService } from '../../../core/services/meta.service';
import { SEO_CONFIG } from '../../../core/config/seo-config';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    message: string;
}

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    contact = signal<any>(null);
    loading = signal(true);
    submitting = signal(false);
    submitted = signal(false);

    formData: ContactForm = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };

    socialLinks = [
        { icon: 'link', label: 'LinkedIn', url: '' },
        { icon: 'code', label: 'GitHub', url: '' },
        { icon: 'chat', label: 'Twitter', url: '' },
        { icon: 'photo_camera', label: 'Instagram', url: '' }
    ];

    heroContent = {
        title: 'Get In Touch',
        description: "Have a project in mind or just want to connect? I'd love to hear from you!"
    };

    constructor(private contentService: ContentService, private meta: MetaService) { }

    ngOnInit() {
        this.loadHeroContent();
        this.meta.updateTags(SEO_CONFIG.contact);
        this.loadContact();
    }

    loadHeroContent() {
        const saved = localStorage.getItem('hero_contact');
        if (saved) {
            this.heroContent = JSON.parse(saved);
        }
    }

    loadContact() {
        this.contentService.getContact().subscribe({
            next: (contact) => {
                this.contact.set(contact);
                this.updateSocialLinks();
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading contact:', error);
                this.loading.set(false);
            }
        });
    }

    updateSocialLinks() {
        const contactData = this.contact();
        if (contactData) {
            this.socialLinks = [
                { icon: 'link', label: 'LinkedIn', url: contactData.linkedin || '#' },
                { icon: 'code', label: 'GitHub', url: contactData.github || '#' },
                { icon: 'chat', label: 'Twitter', url: contactData.twitter || '#' },
                { icon: 'photo_camera', label: 'Instagram', url: contactData.instagram || '#' }
            ];
        }
    }

    async onSubmit() {
        if (!this.formData.name || !this.formData.email || !this.formData.message) {
            return;
        }

        this.submitting.set(true);

        // Submit contact form via API
        this.contentService.submitContactForm(this.formData).subscribe({
            next: (response) => {
                this.submitting.set(false);
                this.submitted.set(true);
                this.formData = { name: '', email: '', phone: '', message: '' };

                // Hide success message after 5 seconds
                setTimeout(() => {
                    this.submitted.set(false);
                }, 5000);
            },
            error: (error) => {
                console.error('Contact form submission error:', error);
                this.submitting.set(false);
                alert('Failed to send message. Please try again or contact me directly via email.');
            }
        });
    }
}
