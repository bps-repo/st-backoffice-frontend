import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../../core/store';
import {lessonsActions} from '../../../../../../core/store/schoolar/lessons/lessons.actions';
import {selectLoadingBulkBooking, selectBulkBookingError} from '../../../../../../core/store/schoolar/lessons/lessons.selectors';
import {Actions, ofType} from '@ngrx/effects';
import {LessonService} from '../../../../../../core/services/lesson.service';
import {StudentService} from '../../../../../../core/services/student.service';
import {Lesson} from '../../../../../../core/models/academic/lesson';
import {Student} from '../../../../../../core/models/academic/student';
import {BulkBookingRequest, BulkBookingResult, BulkBookingLesson} from '../../../../../../core/models/academic/bulk-booking';

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
    bulkBookingForm: FormGroup;
    lessons: Lesson[] = [];
    students: Student[] = [];
    loading = false;
    bulkBookingResults: BulkBookingResult | null = null;
    showResultsDialog = false;
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private lessonService: LessonService,
        private studentService: StudentService,
        private messageService: MessageService,
        private store: Store<AppState>,
        private actions$: Actions
    ) {
        this.bulkBookingForm = this.fb.group({
            selectedLessons: [[], Validators.required],
            selectedStudents: [[], Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadLessons();
        this.loadStudents();

        // Subscribe to bulk booking state
        this.store.select(selectLoadingBulkBooking)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.loading = loading;
            });

        this.store.select(selectBulkBookingError)
            .pipe(takeUntil(this.destroy$))
            .subscribe(error => {
                if (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error
                    });
                }
            });

        // Subscribe to bulk booking success action
        this.actions$.pipe(
            ofType(lessonsActions.bulkBookLessonsSuccess),
            takeUntil(this.destroy$)
        ).subscribe(({response}) => {
            this.bulkBookingResults = response as BulkBookingResult;
            this.showResultsDialog = true;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Bulk booking completed successfully'
            });
            // Reset form after successful booking
            this.bulkBookingForm.reset();
        });
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
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load lessons'
                    });
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
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load students'
                    });
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
        const selectedLessonIds = formValue.selectedLessons;
        const selectedStudentIds = formValue.selectedStudents;

        // Create bulk booking request
        const bulkBookingRequest: BulkBookingRequest = {
            lessons: selectedLessonIds.map((lessonId: string) => ({
                lessonId: lessonId,
                studentIds: selectedStudentIds
            }))
        };

        // Dispatch the bulk booking action
        this.store.dispatch(lessonsActions.bulkBookLessons({bulkBookingRequest}));
    }

    getLessonDisplayName(lesson: Lesson): string {
        return `${lesson.title} - ${new Date(lesson.startDatetime).toLocaleDateString()}`;
    }

    getStudentDisplayName(student: Student): string {
        return `${student.user.firstname} ${student.user.lastname}`;
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | null | undefined {
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
