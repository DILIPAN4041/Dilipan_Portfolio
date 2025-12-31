import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';
import { AIGenerateRequest, AIGenerateResponse } from '../core/models';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    constructor(private api: ApiService) { }

    generateContent(type: AIGenerateRequest['type'], context?: string): Observable<AIGenerateResponse> {
        const request: AIGenerateRequest = { type, context };
        return this.api.post<AIGenerateResponse>('ai/generate', request).pipe(
            map(res => res.data!)
        );
    }

    chat(message: string): Observable<{ message: string; provider: string; timestamp: Date }> {
        return this.api.post<any>('ai/chat', { message }).pipe(
            map(res => res.data!)
        );
    }

    getStatus(): Observable<{ provider: string; configured: boolean; available: boolean; message: string }> {
        return this.api.get<any>('ai/status').pipe(
            map(res => res.data!)
        );
    }

    rephrase(text: string): Observable<{ suggestion: string; provider: string }> {
        return this.api.post<any>('ai/rephrase', { text }).pipe(
            map(res => res.data!)
        );
    }

    generateSEODescription(content: string): Observable<{ description: string; provider: string }> {
        return this.api.post<any>('ai/seo-description', { content }).pipe(
            map(res => res.data!)
        );
    }

    generateSEOTitle(content: string): Observable<{ title: string; provider: string }> {
        return this.api.post<any>('ai/seo-title', { content }).pipe(
            map(res => res.data!)
        );
    }

    generateKeywords(content: string): Observable<{ keywords: string[]; provider: string }> {
        return this.api.post<any>('ai/keywords', { content }).pipe(
            map(res => res.data!)
        );
    }
}
