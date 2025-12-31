import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UploadService } from '../../core/services/upload.service';

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
    template: `
        <div class="image-upload-container">
            <!-- Upload Area -->
            <div 
                class="upload-area"
                [class.dragging]="isDragging()"
                [class.has-image]="imageUrl()"
                (click)="fileInput.click()"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onDrop($event)">
                
                <!-- Preview Image -->
                <div *ngIf="imageUrl()" class="image-preview">
                    <img [src]="imageUrl()" [alt]="fileName()">
                    <button 
                        mat-icon-button 
                        class="remove-btn"
                        (click)="removeImage($event)"
                        *ngIf="!uploading()">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>

                <!-- Upload Prompt -->
                <div *ngIf="!imageUrl()" class="upload-prompt">
                    <mat-icon>cloud_upload</mat-icon>
                    <p>Drag & drop an image here or click to browse</p>
                    <span class="file-types">Supported: JPEG, PNG, WebP, GIF (Max 5MB)</span>
                </div>

                <!-- Progress Bar -->
                <mat-progress-bar 
                    *ngIf="uploading()" 
                    mode="determinate" 
                    [value]="uploadProgress()">
                </mat-progress-bar>
            </div>

            <!-- Hidden File Input -->
            <input 
                #fileInput
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                (change)="onFileSelected($event)"
                style="display: none">

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
            </div>
        </div>
    `,
    styles: [`
        .image-upload-container {
            width: 100%;
        }

        .upload-area {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f8fafc;
            position: relative;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .upload-area:hover {
            border-color: #3b82f6;
            background: #eff6ff;
        }

        .upload-area.dragging {
            border-color: #3b82f6;
            background: #dbeafe;
            transform: scale(1.02);
        }

        .upload-area.has-image {
            padding: 0;
            border: none;
            background: transparent;
        }

        .upload-prompt {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .upload-prompt mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            color: #3b82f6;
        }

        .upload-prompt p {
            margin: 0;
            font-size: 1rem;
            color: #334155;
            font-weight: 500;
        }

        .file-types {
            font-size: 0.875rem;
            color: #64748b;
        }

        .image-preview {
            position: relative;
            width: 100%;
            max-width: 400px;
        }

        .image-preview img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .remove-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
        }

        .remove-btn:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        mat-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 0 0 12px 12px;
        }

        .error-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding: 0.75rem;
            background: #fee2e2;
            border-radius: 8px;
            color: #dc2626;
        }

        .error-message mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
        }
    `]
})
export class ImageUploadComponent {
    @Input() initialImageUrl?: string;
    @Output() imageUploaded = new EventEmitter<string>();
    @Output() imageRemoved = new EventEmitter<void>();

    isDragging = signal(false);
    uploading = signal(false);
    uploadProgress = signal(0);
    imageUrl = signal<string | null>(null);
    fileName = signal<string>('');
    errorMessage = signal<string>('');

    constructor(private uploadService: UploadService) { }

    ngOnInit() {
        if (this.initialImageUrl) {
            this.imageUrl.set(this.initialImageUrl);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFile(input.files[0]);
        }
    }

    handleFile(file: File) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.errorMessage.set('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.errorMessage.set('File too large. Maximum size is 5MB.');
            return;
        }

        this.errorMessage.set('');
        this.fileName.set(file.name);
        this.uploadFile(file);
    }

    uploadFile(file: File) {
        this.uploading.set(true);
        this.uploadProgress.set(0);

        this.uploadService.uploadWithProgress(file).subscribe({
            next: (event) => {
                if (event.progress !== undefined) {
                    this.uploadProgress.set(event.progress);
                }
                if (event.response) {
                    this.uploading.set(false);
                    const url = event.response.data.optimized?.url || event.response.data.original.url;
                    this.imageUrl.set(url);
                    this.imageUploaded.emit(url);
                }
            },
            error: (error) => {
                this.uploading.set(false);
                this.errorMessage.set(error.error?.message || 'Upload failed. Please try again.');
                console.error('Upload error:', error);
            }
        });
    }

    removeImage(event: Event) {
        event.stopPropagation();
        this.imageUrl.set(null);
        this.fileName.set('');
        this.errorMessage.set('');
        this.imageRemoved.emit();
    }
}
