import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentService } from '../../../services/content.service';

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    expanded?: boolean;
}

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    messages = signal<ContactMessage[]>([]);
    loading = signal(true);
    unreadCount = signal(0);
    deleting = signal<string | null>(null);

    constructor(private contentService: ContentService) { }

    ngOnInit() {
        this.loadMessages();
    }

    loadMessages() {
        this.loading.set(true);
        this.contentService.getContactMessages().subscribe({
            next: (response: any) => {
                // Messages loaded successfully
                this.messages.set(response.data);
                this.unreadCount.set(response.unreadCount);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading messages:', error);
                this.loading.set(false);
            }
        });
    }

    getMessagePreview(message: string): string {
        return message.length > 100 ? message.substring(0, 100) + '...' : message;
    }

    getTimeAgo(date: string): string {
        const now = new Date().getTime();
        const messageDate = new Date(date).getTime();
        const diff = now - messageDate;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    toggleRead(message: ContactMessage) {
        this.contentService.markMessageAsRead(message._id, !message.isRead).subscribe({
            next: () => {
                message.isRead = !message.isRead;
                this.unreadCount.set(this.messages().filter(m => !m.isRead).length);
            },
            error: (error) => {
                console.error('Error updating message:', error);
            }
        });
    }

    deleteMessage(messageId: string) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        this.deleting.set(messageId);
        this.contentService.deleteContactMessage(messageId).subscribe({
            next: () => {
                this.messages.set(this.messages().filter(m => m._id !== messageId));
                this.unreadCount.set(this.messages().filter(m => !m.isRead).length);
                this.deleting.set(null);
            },
            error: (error) => {
                console.error('Error deleting message:', error);
                this.deleting.set(null);
            }
        });
    }

    toggleExpansion(message: ContactMessage) {
        message.expanded = !message.expanded;
    }
}
