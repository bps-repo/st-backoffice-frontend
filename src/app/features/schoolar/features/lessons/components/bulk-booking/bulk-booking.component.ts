import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {BadgeModule} from 'primeng/badge';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {LessonService} from '../../../../../../core/services/lessons/lesson.service';
import {StudentService} from '../../../../../../core/services/student.service';
import {Lesson} from '../../../../../../core/models/academic/lesson';
import {Student} from '../../../../../../core/models/academic/students/student';
import {
    BulkBookingRequest,
    BulkBookingResult,
    BulkBookingLesson
} from '../../../../../../core/models/academic/bulk-booking';
import {ShowToastErrorService} from '../../../../../../shared/services/show-toast-error-service';

export type severtyType = "warn" | "success" | "info" | "danger" | "secondary" | "contrast";

@Component({
    selector: 'app-bulk-booking',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        TableModule,
        BadgeModule,
        ProgressSpinnerModule,
        DialogModule
    ],
    providers: [MessageService],
    templateUrl: './bulk-booking.component.html',
    styleUrls: ['./bulk-booking.component.scss']
})
export class BulkBookingComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    private lessonService = inject(LessonService);
    private studentService = inject(StudentService);
    private messageService = inject(MessageService);

    bulkBookingForm: FormGroup;
    lessons: Lesson[] = [];
    students: Student[] = [];
    loading = false;
    bulkBookingResults: BulkBookingResult | null = null;
    showResultsDialog = false;
    private destroy$ = new Subject<void>();

    constructor() {
        this.bulkBookingForm = this.fb.group({
            selectedLessons: [[], Validators.required],
            selectedStudents: [[], Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadLessons();
        this.loadStudents();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadLessons(): void {
        this.lessonService.getAllLessons()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (lessons) => {
                    this.lessons = lessons;
                },
                error: (error) => {
                    console.error('Error loading lessons:', error);
                    ShowToastErrorService.showToastError('Error', error, this.messageService, 'Failed to load lessons');
                }
            });
    }

    loadStudents(): void {
        this.studentService.getStudents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (students) => {
                    this.students = students;
                },
                error: (error) => {
                    console.error('Error loading students:', error);
                    ShowToastErrorService.showToastError('Error', error, this.messageService, 'Failed to load students');
                }
            });
    }

    submitBulkBooking(): void {
        if (this.bulkBookingForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please select at least one lesson and one student'
            });
            return;
        }

        const formValue = this.bulkBookingForm.value;
        const selectedLessonIds: string[] = formValue.selectedLessons;
        const selectedStudentIds: string[] = formValue.selectedStudents;

        const bulkBookingRequest: BulkBookingRequest = {
            lessons: selectedLessonIds.map((lessonId) => ({
                lessonId,
                studentIds: selectedStudentIds
            }))
        };

        this.loading = true;
        this.lessonService.bulkBookLessons(bulkBookingRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.loading = false;
                    this.bulkBookingResults = response;
                    this.showResultsDialog = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Marcação em bloco realizada com sucesso'
                    });
                    this.bulkBookingForm.reset();
                },
                error: (error) => {
                    this.loading = false;
                    ShowToastErrorService.showToastError('Erro', error, this.messageService);
                }
            });
    }


    getStatusSeverity(status: string): severtyType {
        switch (status) {
            case 'BOOKED':
                return 'success';
            case 'FAILED':
                return 'danger';
            default:
                return 'info';
        }
    }

    formatDate(dateString: string | Date): string {
        return new Date(dateString).toLocaleDateString();
    }

    formatTime(dateString: string | Date): string {
        return new Date(dateString).toLocaleTimeString();
    }

    closeResultsDialog(): void {
        this.showResultsDialog = false;
        this.bulkBookingResults = null;
    }
}
