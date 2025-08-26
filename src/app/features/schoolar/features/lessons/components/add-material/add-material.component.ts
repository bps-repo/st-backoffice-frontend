import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {FileUploadModule} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {Lesson} from "../../../../../../core/models/academic/lesson";
import {Material} from "../../../../../../core/models/academic/material";
import {LessonService} from "../../../../../../core/services/lesson.service";

@Component({
    selector: 'app-add-material',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        FileUploadModule,
        ToastModule,
        DropdownModule
    ],
    providers: [MessageService],
    templateUrl: './add-material.component.html'
})
export class AddMaterialComponent implements OnInit, OnDestroy {
    lessonId: string | null = null;
    lesson: Lesson | null = null;
    newMaterial: Partial<Material> = {
        active: true
    };
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private lessonApiService: LessonService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        // Get the lesson ID from the route
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.lessonId = params['lessonId'];
                if (this.lessonId) {
                    this.loadLesson(this.lessonId);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadLesson(id: string): void {
        this.loading = true;
        this.lessonApiService.getLesson(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (lesson) => {
                    this.lesson = lesson;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading lesson:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load lesson details'
                    });
                    this.loading = false;
                }
            });
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

    addMaterial(): void {
        if (!this.newMaterial.title || !this.newMaterial.type || !this.newMaterial.fileUrl) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        if (!this.lesson) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No lesson selected'
            });
            return;
        }

        this.loading = true;

        // Create a new material object
        const material: Material = {
            id: Date.now().toString(), // Generate a temporary ID
            title: this.newMaterial.title!,
            description: this.newMaterial.description || '',
            type: this.newMaterial.type!,
            fileUrl: this.newMaterial.fileUrl!,
            uploadDate: new Date().toISOString(),
            uploader: {id: '1', name: 'Current User'}, // In a real app, this would be the current user
            active: true,
            availabilityStartDate: this.newMaterial.availabilityStartDate || '',
            availabilityEndDate: this.newMaterial.availabilityEndDate || '',
            units: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add the material to the lesson's materials array
        const updatedLesson: Lesson = {
            ...this.lesson,
            materials: [...(this.lesson.materials || []), material]
        };

        // Update the lesson
        this.lessonApiService.updateLesson(updatedLesson)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Material added successfully'
                    });
                    this.loading = false;

                    // Navigate back to the lesson student page after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/schoolar/lessons', this.lessonId]);
                    }, 1500);
                },
                error: (error) => {
                    console.error('Error adding material:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add material'
                    });
                    this.loading = false;
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/lessons', this.lessonId]);
    }
}
