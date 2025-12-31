import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        original: {
            filename: string;
            url: string;
            size: number;
        };
        optimized?: {
            filename: string;
            url: string;
        };
        thumbnail?: {
            filename: string;
            url: string;
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = `${environment.apiUrl}/upload`;

    constructor(private http: HttpClient) { }

    uploadSingle(file: File): Observable<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post<UploadResponse>(`${this.apiUrl}/single`, formData);
    }

    uploadMultiple(files: File[]): Observable<UploadResponse> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        return this.http.post<UploadResponse>(`${this.apiUrl}/multiple`, formData);
    }

    uploadWithProgress(file: File): Observable<{ progress: number; response?: UploadResponse }> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post<UploadResponse>(`${this.apiUrl}/single`, formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map((event: HttpEvent<any>) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
                        return { progress };
                    case HttpEventType.Response:
                        return { progress: 100, response: event.body };
                    default:
                        return { progress: 0 };
                }
            })
        );
    }

    deleteImage(filename: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${filename}`);
    }
}
