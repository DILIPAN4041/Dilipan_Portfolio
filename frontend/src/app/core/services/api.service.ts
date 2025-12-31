import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // GET request
    get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, { params })
            .pipe(catchError(this.handleError));
    }

    // POST request
    post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(catchError(this.handleError));
    }

    // PUT request
    put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(catchError(this.handleError));
    }

    // DELETE request
    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`)
            .pipe(catchError(this.handleError));
    }

    // PATCH request
    patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(catchError(this.handleError));
    }

    // Error handler
    private handleError(error: any): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error?.message || error.message || errorMessage;
        }

        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
