import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Lesson } from "../../../../../../../../core/models/academic/lesson";
import { Material } from "../../../../../../../../core/models/academic/material";
import { LessonService } from "../../../../../../../../core/services/lesson.service";

@Component({
    selector: 'app-materials-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        FileUploadModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './materials.component.html'
})
export class MaterialsComponent implements OnInit, OnDestroy {
    lessonItem: Lesson | null = null;
    materials: Material[] = [];
    displayAddDialog: boolean = false;
    newMaterial: Partial<Material> = {};

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private lessonApiService: LessonService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showAddMaterialDialog(): void {
        this.newMaterial = {
            active: true
        };
        this.displayAddDialog = true;
    }

    hideAddMaterialDialog(): void {
        this.displayAddDialog = false;
    }

    getMaterialTypeIcon(type: string): string {
        switch (type?.toLowerCase()) {
            case 'pdf':
                return 'pi pi-file-pdf';
            case 'doc':
            case 'docx':
                return 'pi pi-file-word';
            case 'xls':
            case 'xlsx':
                return 'pi pi-file-excel';
            case 'ppt':
            case 'pptx':
                return 'pi pi-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'pi pi-image';
            case 'mp4':
            case 'avi':
            case 'mov':
                return 'pi pi-video';
            case 'mp3':
            case 'wav':
                return 'pi pi-volume-up';
            case 'zip':
            case 'rar':
                return 'pi pi-file-zip';
            default:
                return 'pi pi-file';
        }
    }

    formatDate(date: string): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    addMaterial(): void {
        if (!this.newMaterial.title || !this.newMaterial.type || !this.newMaterial.fileUrl) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        if (!this.lessonItem) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No lesson selected'
            });
            return;
        }

        // Create a new material object
        const material: Material = {
            id: Date.now().toString(), // Generate a temporary ID
            title: this.newMaterial.title!,
            description: this.newMaterial.description || '',
            type: this.newMaterial.type!,
            fileUrl: this.newMaterial.fileUrl!,
            uploadDate: new Date().toISOString(),
            uploader: { id: '1', name: 'Current User' }, // In a real app, this would be the current user
            active: true,
            availabilityStartDate: this.newMaterial.availabilityStartDate || '',
            availabilityEndDate: this.newMaterial.availabilityEndDate || '',
            units: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add the material to the lesson's materials array
        const updatedLesson: Lesson = {
            ...this.lessonItem,
            materials: [...(this.lessonItem.materials || []), material]
        };

        // Update the lesson
        this.lessonApiService.updateLesson(updatedLesson)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (lesson) => {
                    this.lessonItem = lesson;
                    this.materials = lesson.materials || [];
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Material added successfully'
                    });
                    this.hideAddMaterialDialog();
                },
                error: (error) => {
                    console.error('Error adding material:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add material'
                    });
                }
            });
    }

    // This would be implemented with actual API calls in a real application
    downloadMaterial(material: Material): void {
        // Mock implementation - in a real app, this would call a service
        console.log('Downloading material:', material);
        window.open(material.fileUrl, '_blank');
    }

    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            // In a real app, this would upload the file to a server and get a URL back
            // For now, we'll just set a mock URL and extract the file type
            const fileType = file.name.split('.').pop().toLowerCase();
            this.newMaterial.fileUrl = `https://example.com/uploads/${file.name}`;
            this.newMaterial.type = fileType;

            this.messageService.add({
                severity: 'info',
                summary: 'File Selected',
                detail: `${file.name} selected (mock upload)`
            });
        }
    }

    onFileUploadError(event: any): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: event.error ? event.error.message : 'File upload failed'
        });
    }

    navigateToAddMaterial(): void {
        if (this.lessonItem?.id) {
            this.router.navigate(['/schoolar/lessons/materials/add', this.lessonItem.id]);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No lesson selected'
            });
        }
    }
}
