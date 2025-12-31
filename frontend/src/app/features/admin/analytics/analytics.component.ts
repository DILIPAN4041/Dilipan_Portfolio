import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../core/services/api.service';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
    loading = signal(true);
    totalLogs = signal(0);
    recentLogs = signal(0);
    activityLogs = signal<any[]>([]);
    actionStats = signal<any[]>([]);

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadStats();
        this.loadActivityLogs();
    }

    loadStats() {
        this.api.get<any>('activity/stats').subscribe({
            next: (res: any) => {
                this.totalLogs.set(res.data.total);
                this.recentLogs.set(res.data.last24Hours);
                this.actionStats.set(res.data.byAction || []);
            },
            error: (err: any) => {
                console.error('Failed to load stats:', err);
            }
        });
    }

    loadActivityLogs() {
        this.api.get<any>('activity?limit=50').subscribe({
            next: (res: any) => {
                this.activityLogs.set(res.data);
                this.loading.set(false);
            },
            error: (err: any) => {
                console.error('Failed to load activity logs:', err);
                this.loading.set(false);
            }
        });
    }

    refresh() {
        this.loading.set(true);
        this.loadStats();
        this.loadActivityLogs();
    }

    getActionIcon(action: string): string {
        const icons: any = {
            'create': 'add_circle',
            'update': 'edit',
            'delete': 'delete',
            'view': 'visibility',
            'login': 'login',
            'logout': 'logout'
        };
        return icons[action] || 'info';
    }

    getActionColor(action: string): string {
        const colors: any = {
            'create': 'success',
            'update': 'primary',
            'delete': 'warn',
            'view': 'accent'
        };
        return colors[action] || 'primary';
    }
}
