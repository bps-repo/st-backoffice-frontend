// src/app/features/schoolar/features/assessments/pages/detail/tabs/students/students.component.ts
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Assessment } from 'src/app/core/models/academic/assessment';
import { AssessmentBooking, BulkBookingResultEntry } from 'src/app/core/models/academic/assessment-booking';
import { AssessmentBookingStatus } from 'src/app/core/enums/assessment-booking-status';
import { AssessmentBookingService } from 'src/app/core/services/assessment-booking.service';
import { StudentService } from 'src/app/core/services/student.service';
import { Student } from 'src/app/core/models/academic/students/student';
import { ASSESSMENT_DETAIL_TOKEN } from 'src/app/shared/tokens/assessment-detail.token';

@Component({
    selector: 'app-students',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        AvatarModule,
        TooltipModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit, OnDestroy {
    private bookingService = inject(AssessmentBookingService);
    private studentService = inject(StudentService);
    private messageService = inject(MessageService);
    readonly assessment = inject<Assessment | null>(ASSESSMENT_DETAIL_TOKEN, { optional: true });

    readonly bookings = signal<AssessmentBooking[]>([]);
    readonly loading = signal(true);
    readonly error = signal<string | null>(null);

    // Dialog state
    readonly dialogVisible = signal(false);
    readonly allStudents = signal<Student[]>([]);
    readonly studentsLoading = signal(false);
    readonly selectedStudents = signal<Student[]>([]);
    readonly searchQuery = signal('');
    readonly booking = signal(false);
    readonly bookingResults = signal<BulkBookingResultEntry[] | null>(null);

    private readonly searchSubject = new Subject<string>();
    private readonly destroy$ = new Subject<void>();

    readonly statusLabels: Record<string, string> = {
        [AssessmentBookingStatus.BOOKED]: 'Agendado',
        [AssessmentBookingStatus.CANCELLED]: 'Cancelado',
        [AssessmentBookingStatus.COMPLETED]: 'Compareceu',
        [AssessmentBookingStatus.MISSED]: 'Faltou',
    };

    readonly statusSeverity: Record<string, 'info' | 'success' | 'danger' | 'warn'> = {
        [AssessmentBookingStatus.BOOKED]: 'info',
        [AssessmentBookingStatus.CANCELLED]: 'danger',
        [AssessmentBookingStatus.COMPLETED]: 'success',
        [AssessmentBookingStatus.MISSED]: 'warn',
    };

    ngOnInit(): void {
        this.loadBookings();

        this.searchSubject.pipe(
            debounceTime(250),
            switchMap(query => {
                this.studentsLoading.set(true);
                const filters = query.trim() ? { fullName: query.trim() } : {};
                return this.studentService.searchStudents(filters).pipe(
                    catchError(() => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível carregar a lista de alunos.',
                        });
                        return of([]);
                    })
                );
            }),
            takeUntil(this.destroy$)
        ).subscribe(students => {
            this.allStudents.set(students);
            this.studentsLoading.set(false);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openBookingDialog(): void {
        this.selectedStudents.set([]);
        this.searchQuery.set('');
        this.bookingResults.set(null);
        this.allStudents.set([]);
        this.dialogVisible.set(true);
        this.searchSubject.next('');
    }

    onSearchChange(query: string): void {
        this.searchQuery.set(query);
        this.searchSubject.next(query);
    }

    confirmBooking(): void {
        const ids = this.selectedStudents().map((s) => s.id!);
        if (!ids.length || !this.assessment?.id) return;

        this.booking.set(true);
        this.bookingService.bulkBook({ assessmentId: this.assessment.id, studentIds: ids }).subscribe({
            next: (results) => {
                this.booking.set(false);
                this.bookingResults.set(results);
                const successCount = results.filter((r) => r.success).length;
                if (successCount > 0) this.loadBookings();
            },
            error: (err: HttpErrorResponse) => {
                this.booking.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err.error?.error ?? 'Não foi possível realizar o agendamento.',
                });
            },
        });
    }

    closeDialog(): void {
        this.dialogVisible.set(false);
    }

    studentFullName(student: Student): string {
        return `${student.user?.firstname ?? ''} ${student.user?.lastname ?? ''}`.trim();
    }

    private loadBookings(): void {
        if (!this.assessment?.id) {
            this.loading.set(false);
            return;
        }

        this.bookingService.getBookingsByAssessment(this.assessment.id).subscribe({
            next: (data) => {
                this.bookings.set(data);
                this.loading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                this.error.set(err.error?.error ?? 'Não foi possível carregar os agendamentos.');
                this.loading.set(false);
            },
        });
    }
}
