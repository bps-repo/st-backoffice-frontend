import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { Student } from 'src/app/core/models/academic/student';
import { AvailableStudent } from 'src/app/core/models/academic/available-student';
import { BulkBookingRequest, BulkBookingResult, FailedBooking } from 'src/app/core/models/academic/bulk-booking';
import { LessonService } from 'src/app/core/services/lesson.service';
import { StudentService } from 'src/app/core/services/student.service';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { Store } from '@ngrx/store';
import * as LessonActions from 'src/app/core/store/schoolar/lessons/lessons.actions';
import * as StudentActions from 'src/app/core/store/schoolar/students/students.actions';
import { selectAllLessons, selectLessonBookings } from 'src/app/core/store/schoolar/lessons/lessons.selectors';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LessonStatus } from 'src/app/core/enums/lesson-status';
@Component({
    selector: 'app-schedule-lessons',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, BadgeModule, CardModule, ProgressSpinnerModule, ScrollPanelModule, ToastModule],
    templateUrl: './schedule-lessons.component.html'
})
export class ScheduleLessonsComponent implements OnInit, OnDestroy {
    lessons: Lesson[] = [];
    filteredLessons: Lesson[] = [];
    selectedLesson: Lesson | null = null;

    // right panel
    enrolled: Student[] = [];
    available: AvailableStudent[] = [];

    // local change tracking
    toAdd: string[] = [];
    toRemove: string[] = [];

    loadingLessons = signal(false);
    loadingStudents = signal(false);
    savingChanges = signal(false);

    searchLessonsCtrl = this.fb.control('');
    searchStudentsCtrl = this.fb.control('');

    private destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly lessonApi: LessonService,
        private readonly studentApi: StudentService,
        private readonly store: Store,
        private readonly messageService: MessageService
    ) {
        this.store.dispatch(LessonActions.lessonsActions.loadLessons());
        this.store.dispatch(StudentActions.StudentsActions.loadStudents());
    }

    ngOnInit(): void {
        this.loadLessons();

        // filter on search
        this.searchLessonsCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((term) => this.applyLessonFilter(String(term || '')));
        this.searchStudentsCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((term) => this.applyStudentsFilter(String(term || '')));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadLessons() {
        this.loadingLessons.set(true);
        this.store.select(selectAllLessons).pipe(
            takeUntil(this.destroy$),
            filter((lessons) => lessons !== null),
            map((lessons) => lessons!.filter((lesson) => lesson.status === LessonStatus.AVAILABLE)),
        ).subscribe({
            next: (lessons) => {
                this.lessons = lessons as Lesson[];
                this.filteredLessons = lessons;
                this.loadingLessons.set(false);
            },
            error: () => {
                this.loadingLessons.set(false);
            }
        });
    }

    selectLesson(lesson: Lesson) {
        this.selectedLesson = lesson;
        if (lesson.id) {
            this.loadLessonStudents(lesson.id);
        }
        this.toAdd = [];
        this.toRemove = [];
    }

    private loadLessonStudents(lessonId: string) {
        this.loadingStudents.set(true);

        // Load available students for the lesson using the new endpoint
        this.lessonApi.getAvailableStudentsForLesson(lessonId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (availableStudents) => {
                this.available = availableStudents;

                // Get existing bookings to show enrolled students
                this.store.select(selectLessonBookings).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (bookings) => {
                        const bookedIds = Array.isArray(bookings) ? bookings.map((b: any) => b.studentId) : [];
                        // Load all students to get enrolled ones
                        this.studentApi.getStudents().pipe(takeUntil(this.destroy$)).subscribe({
                            next: (students) => {
                                const byId: Record<string, Student> = Object.fromEntries(students.map(s => [s.id!, s]));
                                this.enrolled = bookedIds.map((id: string) => byId[id]).filter(Boolean);
                                this.loadingStudents.set(false);
                            },
                            error: () => { this.loadingStudents.set(false); }
                        });
                    },
                    error: () => { this.loadingStudents.set(false); }
                });
            },
            error: () => { this.loadingStudents.set(false); }
        });
    }

    addStudent(student: AvailableStudent) {
        if (!this.selectedLesson || !student.id) return;
        if (this.enrolled.find(s => s.id === student.id)) return;

        // Convert AvailableStudent to Student for enrolled list
        const studentToAdd: Student = {
            id: student.id,
            code: student.code,
            user: {
                id: student.id,
                firstname: student.firstName,
                lastname: student.lastName,
                email: student.email,
                phone: student.phoneNumber,
                birthdate: student.birthdate,
                roleName: 'STUDENT',
                gender: 'UNKNOWN',
                status: 'ACTIVE' as any
            },
            status: 'ACTIVE' as any,
            levelProgressPercentage: 0,
            centerId: student.centerId,
            levelId: student.levelId,
            enrollmentDate: new Date().toISOString()
        };

        this.enrolled = [...this.enrolled, studentToAdd];
        this.available = this.available.filter(s => s.id !== student.id);
        // record diff
        if (!this.toAdd.includes(student.id)) this.toAdd.push(student.id);
        // undo removal if toggled
        this.toRemove = this.toRemove.filter(id => id !== student.id);
    }

    removeStudent(student: Student) {
        if (!this.selectedLesson || !student.id) return;

        // Convert Student back to AvailableStudent for available list
        const availableStudent: AvailableStudent = {
            id: student.id!,
            code: student.code,
            firstName: student.user?.firstname || '',
            lastName: student.user?.lastname || '',
            email: student.user?.email || '',
            phoneNumber: student.user?.phone || '',
            birthdate: student.user?.birthdate || '',
            currentUnitId: student.currentUnit?.id || '',
            currentUnitName: student.currentUnit?.name || '',
            levelId: student.levelId,
            levelName: '', // We don't have this in Student model
            centerId: student.centerId,
            centerName: '' // We don't have this in Student model
        };

        this.available = [availableStudent, ...this.available];
        this.enrolled = this.enrolled.filter(s => s.id !== student.id);
        // record diff
        // if student was newly added this session, undo add; else mark for remove
        if (this.toAdd.includes(student.id)) {
            this.toAdd = this.toAdd.filter(id => id !== student.id);
        } else if (!this.toRemove.includes(student.id)) {
            this.toRemove.push(student.id);
        }
    }

    saveChanges() {
        if (!this.selectedLesson || !this.selectedLesson.id) return;

        this.savingChanges.set(true);



        // Prepare bulk booking request with current enrolled students
        const enrolledStudentIds = this.enrolled.map(student => student.id!).filter(Boolean);
        const bulkRequest: BulkBookingRequest = {
            lessons: [{
                lessonId: this.selectedLesson.id,
                studentIds: enrolledStudentIds
            }]
        };

        console.log("bulkRequest", bulkRequest);

        // Use bulk booking API
        this.lessonApi.bulkBookLessons(bulkRequest).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response: BulkBookingResult) => {
                this.savingChanges.set(false);

                if (response.successfulBookings > 0) {
                    const { successfulBookings, failedBookings, failedBookingsList } = response;

                    if (failedBookings === 0) {
                        // All bookings successful
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: `${successfulBookings} aluno(s) matriculado(s) com sucesso!`
                        });
                    } else if (successfulBookings > 0) {
                        // Partial success
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: `${successfulBookings} aluno(s) matriculado(s), ${failedBookings} falharam. Verifique os detalhes.`
                        });

                        // Show details of failed bookings
                        failedBookingsList.forEach((failed: FailedBooking) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro na matrícula',
                                detail: `Aluno ${failed.studentId}: ${failed.errorMessage}`
                            });
                        });
                    } else {
                        // All bookings failed
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao matricular alunos. Tente novamente.'
                        });
                    }

                    // Clear change tracking
                    this.toAdd = [];
                    this.toRemove = [];

                    // Reload students to reflect changes
                    if (this.selectedLesson?.id) {
                        this.loadLessonStudents(this.selectedLesson.id);
                    }
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: response.failedBookingsList.map((failed: FailedBooking) => failed.errorMessage).join(', ') || 'Falha ao processar matrículas'
                    });
                }
            },
            error: (error: any) => {
                this.savingChanges.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: error.message || 'Erro de conexão. Tente novamente.'
                });
                console.error('Bulk booking error:', error);
            }
        });
    }

    private applyLessonFilter(term: string) {
        const t = term.toLowerCase();
        this.filteredLessons = this.lessons.filter(l =>
            (l.title || '').toLowerCase().includes(t) ||
            (l.teacher || '').toLowerCase().includes(t)
        );
    }

    private applyStudentsFilter(_term: string) {
        // UI-only search handled in template via pipe/filter if needed; keeping placeholder for potential future logic
    }

    // Helper methods to safely access user properties
    getStudentName(student: Student): string {
        if (student.user?.firstname && student.user?.lastname) {
            return `${student.user.firstname} ${student.user.lastname}`;
        }
        return student.user?.firstname || student.user?.lastname || 'Unknown Student';
    }

    getStudentEmail(student: Student): string {
        return student.user?.email || 'No email';
    }

    // Helper methods for AvailableStudent
    getAvailableStudentName(student: AvailableStudent): string {
        return `${student.firstName} ${student.lastName}`;
    }

    getAvailableStudentEmail(student: AvailableStudent): string {
        return student.email || 'No email';
    }
}


