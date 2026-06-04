import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { Student } from 'src/app/core/models/academic/students/student';
import { AvailableStudent } from 'src/app/core/models/academic/available-student';
import { BulkBookingRequest, BulkBookingResult, FailedBooking } from 'src/app/core/models/academic/bulk-booking';
import { LessonService } from 'src/app/core/services/lessons/lesson.service';
import { StudentService } from 'src/app/core/services/student.service';
import { LevelService } from 'src/app/core/services/level.service';
import { catchError, debounceTime, EMPTY, exhaustMap, Subject, takeUntil, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LessonStatus } from 'src/app/core/enums/lesson-status';
import { SelectItem } from 'primeng/api';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

export type ScheduleMode = 'lesson-to-students' | 'student-to-lessons';

@Component({
    selector: 'app-schedule-lessons',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, BadgeModule,
        CardModule, ProgressSpinnerModule, SkeletonModule, ScrollPanelModule, ToastModule, DropdownModule, TooltipModule
    ],
    templateUrl: './schedule-lessons.component.html'
})
export class ScheduleLessonsComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly lessonApi = inject(LessonService);
    private readonly studentApi = inject(StudentService);
    private readonly levelService = inject(LevelService);
    private readonly messageService = inject(MessageService);
    private readonly route = inject(ActivatedRoute);

    // ── Mode ────────────────────────────────────────────────────────────────
    mode = signal<ScheduleMode>('lesson-to-students');

    // ── Lesson-to-Students state ─────────────────────────────────────────────
    lessons: Lesson[] = [];
    selectedLesson: Lesson | null = null;

    enrolled: Student[] = [];
    available: AvailableStudent[] = [];

    toAdd: string[] = [];
    toRemove: string[] = [];

    loadingLessons = signal(false);
    loadingMoreLessons = signal(false);
    loadingStudents = signal(false);
    savingChanges = signal(false);

    lessonsHasMore = false;
    private lessonsPage = 0;
    private readonly lessonsPageSize = 20;

    searchLessonsCtrl = this.fb.control('');
    levelFilterCtrl = this.fb.control(null);

    levelOptions: SelectItem[] = [];
    loadingLevels = signal(false);

    // ── Student-to-Lessons state ─────────────────────────────────────────────
    students: Student[] = [];
    selectedStudent: Student | null = null;

    availableLessonsForStudent: Lesson[] = [];
    lessonsToEnroll: Lesson[] = [];

    loadingStudentsList = signal(false);
    loadingMoreStudents = signal(false);
    loadingAvailableLessons = signal(false);
    savingStudentLessons = signal(false);

    studentsHasMore = false;
    private studentsPage = 0;
    private readonly studentsPageSize = 20;

    searchStudentsListCtrl = this.fb.control('');

    // ── Shared ────────────────────────────────────────────────────────────────
    searchStudentsCtrl = this.fb.control('');

    private destroy$ = new Subject<void>();
    private loadMoreLessons$ = new Subject<void>();
    private loadMoreStudents$ = new Subject<void>();

    ngOnInit(): void {
        this.loadLessons();
        this.loadStudents();
        this.loadLevels();

        // exhaustMap drops scroll emissions that arrive while a request is in-flight,
        // and page-increment only happens when a request actually fires.
        this.loadMoreLessons$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                this.lessonsPage++;
                this.loadingMoreLessons.set(true);
                return this.lessonApi.searchLessons({
                    status: LessonStatus.AVAILABLE,
                    titleContains: this.searchLessonsCtrl.value || undefined,
                    levelId: this.levelFilterCtrl.value || undefined,
                    page: this.lessonsPage,
                    size: this.lessonsPageSize
                }).pipe(
                    tap(response => {
                        this.lessons = [...this.lessons, ...(response.content ?? []) as Lesson[]];
                        this.lessonsHasMore = !response.last;
                        this.loadingMoreLessons.set(false);
                    }),
                    catchError(() => {
                        this.loadingMoreLessons.set(false);
                        return EMPTY;
                    })
                );
            })
        ).subscribe();

        this.loadMoreStudents$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                this.studentsPage++;
                this.loadingMoreStudents.set(true);
                return this.studentApi.searchStudentsPaginated(
                    { fullName: this.searchStudentsListCtrl.value || undefined },
                    this.studentsPage,
                    this.studentsPageSize
                ).pipe(
                    tap(response => {
                        this.students = [...this.students, ...(response.content ?? [])];
                        this.studentsHasMore = !response.last;
                        this.loadingMoreStudents.set(false);
                    }),
                    catchError(() => {
                        this.loadingMoreStudents.set(false);
                        return EMPTY;
                    })
                );
            })
        ).subscribe();

        this.searchLessonsCtrl.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300)
        ).subscribe(() => this.loadLessons());

        this.levelFilterCtrl.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => this.loadLessons());

        this.searchStudentsListCtrl.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(300)
        ).subscribe(() => this.loadStudents());

        // Auto-select lesson from query param
        const preselectedLessonId = this.route.snapshot.queryParamMap.get('lessonId');
        if (preselectedLessonId) {
            this.lessonApi.getLesson(preselectedLessonId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({ next: (lesson) => this.selectLesson(lesson) });
        }

        // Auto-select student from query param
        const preselectedStudentId = this.route.snapshot.queryParamMap.get('studentId');
        if (preselectedStudentId) {
            this.mode.set('student-to-lessons');
            this.studentApi.getStudent(preselectedStudentId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({ next: (student) => this.selectStudent(student) });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // ── Mode toggle ──────────────────────────────────────────────────────────
    toggleMode(): void {
        const next: ScheduleMode = this.mode() === 'lesson-to-students' ? 'student-to-lessons' : 'lesson-to-students';
        this.mode.set(next);
        this.resetLessonToStudentsState();
        this.resetStudentToLessonsState();
    }

    private resetLessonToStudentsState(): void {
        this.selectedLesson = null;
        this.enrolled = [];
        this.available = [];
        this.toAdd = [];
        this.toRemove = [];
        this.searchLessonsCtrl.setValue('', { emitEvent: false });
    }

    private resetStudentToLessonsState(): void {
        this.selectedStudent = null;
        this.availableLessonsForStudent = [];
        this.lessonsToEnroll = [];
        this.searchStudentsListCtrl.setValue('', { emitEvent: false });
    }

    // ── Lesson-to-Students logic ─────────────────────────────────────────────
    private loadLessons(): void {
        this.lessonsPage = 0;
        this.lessons = [];
        this.lessonsHasMore = false;
        this.loadingLessons.set(true);

        this.lessonApi.searchLessons({
            status: LessonStatus.AVAILABLE,
            titleContains: this.searchLessonsCtrl.value || undefined,
            levelId: this.levelFilterCtrl.value || undefined,
            page: 0,
            size: this.lessonsPageSize
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                this.lessons = (response.content ?? []) as Lesson[];
                this.lessonsHasMore = !response.last;
                this.loadingLessons.set(false);
            },
            error: () => this.loadingLessons.set(false)
        });
    }

    onLessonsScroll(event: Event): void {
        const el = event.target as HTMLElement;
        if (this.lessonsHasMore && !this.loadingMoreLessons() && !this.loadingLessons()) {
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
                this.loadMoreLessons$.next();
            }
        }
    }

    private loadLevels(): void {
        this.loadingLevels.set(true);
        this.levelService.getLevels().pipe(takeUntil(this.destroy$)).subscribe({
            next: (levels) => {
                this.levelOptions = [
                    { label: 'Todos os níveis', value: null },
                    ...(levels || []).map(level => ({ label: level.name, value: level.id }))
                ];
                this.loadingLevels.set(false);
            },
            error: () => {
                this.levelOptions = [{ label: 'Todos os níveis', value: null }];
                this.loadingLevels.set(false);
            }
        });
    }

    selectLesson(lesson: Lesson): void {
        this.selectedLesson = lesson;
        if (lesson.id) {
            this.loadLessonStudents(lesson.id);
        }
        this.toAdd = [];
        this.toRemove = [];
    }

    private loadLessonStudents(lessonId: string): void {
        this.loadingStudents.set(true);

        this.lessonApi.getAvailableStudentsForLesson(lessonId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (availableStudents) => {
                this.available = availableStudents;

                this.lessonApi.getLessonBookings(lessonId).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (bookings) => {
                        const bookedIds = Array.isArray(bookings) ? bookings.map((b: any) => b.studentId) : [];
                        this.studentApi.getStudents().pipe(takeUntil(this.destroy$)).subscribe({
                            next: (students) => {
                                const byId: Record<string, Student> = Object.fromEntries(students.map(s => [s.id!, s]));
                                this.enrolled = bookedIds.map((id: string) => byId[id]).filter(Boolean);
                                this.loadingStudents.set(false);
                            },
                            error: () => this.loadingStudents.set(false)
                        });
                    },
                    error: () => this.loadingStudents.set(false)
                });
            },
            error: () => this.loadingStudents.set(false)
        });
    }

    addStudent(student: AvailableStudent): void {
        if (!this.selectedLesson || !student.id) return;
        if (this.enrolled.find(s => s.id === student.id)) return;

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
            center: student.center,
            level: student.level,
            enrollmentDate: new Date().toISOString()
        };

        this.enrolled = [...this.enrolled, studentToAdd];
        this.available = this.available.filter(s => s.id !== student.id);
        if (!this.toAdd.includes(student.id)) this.toAdd.push(student.id);
        this.toRemove = this.toRemove.filter(id => id !== student.id);
    }

    removeStudent(student: Student): void {
        if (!this.selectedLesson || !student.id) return;

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
            level: student.level,
            levelName: student.level?.name || 'N/A',
            center: student.center,
            centerName: student.center.name
        };

        this.available = [availableStudent, ...this.available];
        this.enrolled = this.enrolled.filter(s => s.id !== student.id);
        if (this.toAdd.includes(student.id)) {
            this.toAdd = this.toAdd.filter(id => id !== student.id);
        } else if (!this.toRemove.includes(student.id)) {
            this.toRemove.push(student.id);
        }
    }

    saveChanges(): void {
        if (!this.selectedLesson?.id) return;

        this.savingChanges.set(true);

        const enrolledStudentIds = this.enrolled.map(s => s.id!).filter(Boolean);
        const bulkRequest: BulkBookingRequest = {
            lessons: [{ lessonId: this.selectedLesson.id, studentIds: enrolledStudentIds }]
        };

        this.lessonApi.bulkBookLessons(bulkRequest).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response: BulkBookingResult) => {
                this.savingChanges.set(false);
                this.handleBulkBookingResponse(response);
                this.toAdd = [];
                this.toRemove = [];
                if (this.selectedLesson?.id) {
                    this.loadLessonStudents(this.selectedLesson.id);
                }
            },
            error: (error: any) => {
                this.savingChanges.set(false);
                ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Erro de conexão. Tente novamente.');
            }
        });
    }

    // ── Student-to-Lessons logic ─────────────────────────────────────────────
    private loadStudents(): void {
        this.studentsPage = 0;
        this.students = [];
        this.studentsHasMore = false;
        this.loadingStudentsList.set(true);

        this.studentApi.searchStudentsPaginated(
            { fullName: this.searchStudentsListCtrl.value || undefined },
            0,
            this.studentsPageSize
        ).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                this.students = response.content ?? [];
                this.studentsHasMore = !response.last;
                this.loadingStudentsList.set(false);
            },
            error: () => this.loadingStudentsList.set(false)
        });
    }

    onStudentsScroll(event: Event): void {
        const el = event.target as HTMLElement;
        if (this.studentsHasMore && !this.loadingMoreStudents() && !this.loadingStudentsList()) {
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
                this.loadMoreStudents$.next();
            }
        }
    }

    selectStudent(student: Student): void {
        this.selectedStudent = student;
        this.lessonsToEnroll = [];
        if (student.id) {
            this.loadAvailableLessonsForStudent(student.id);
        }
    }

    private loadAvailableLessonsForStudent(studentId: string): void {
        this.loadingAvailableLessons.set(true);
        this.lessonApi.getAvailableLessonsForStudent(studentId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (lessons) => {
                this.availableLessonsForStudent = lessons;
                this.loadingAvailableLessons.set(false);
            },
            error: () => this.loadingAvailableLessons.set(false)
        });
    }

    addLessonForStudent(lesson: Lesson): void {
        if (!this.selectedStudent || this.lessonsToEnroll.find(l => l.id === lesson.id)) return;
        this.lessonsToEnroll = [...this.lessonsToEnroll, lesson];
        this.availableLessonsForStudent = this.availableLessonsForStudent.filter(l => l.id !== lesson.id);
    }

    removeLessonForStudent(lesson: Lesson): void {
        if (!this.selectedStudent) return;
        this.availableLessonsForStudent = [lesson, ...this.availableLessonsForStudent];
        this.lessonsToEnroll = this.lessonsToEnroll.filter(l => l.id !== lesson.id);
    }

    saveStudentLessons(): void {
        if (!this.selectedStudent?.id || !this.lessonsToEnroll.length) return;

        this.savingStudentLessons.set(true);

        const bulkRequest: BulkBookingRequest = {
            lessons: this.lessonsToEnroll.map(lesson => ({
                lessonId: lesson.id!,
                studentIds: [this.selectedStudent!.id!]
            }))
        };

        this.lessonApi.bulkBookLessons(bulkRequest).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response: BulkBookingResult) => {
                this.savingStudentLessons.set(false);
                this.handleBulkBookingResponse(response);
                this.lessonsToEnroll = [];
                if (this.selectedStudent?.id) {
                    this.loadAvailableLessonsForStudent(this.selectedStudent.id);
                }
            },
            error: (error: any) => {
                this.savingStudentLessons.set(false);
                ShowToastErrorService.showToastError('Erro', error, this.messageService, 'Erro de conexão. Tente novamente.');
            }
        });
    }

    // ── Shared helpers ───────────────────────────────────────────────────────
    private handleBulkBookingResponse(response: BulkBookingResult): void {
        const { successfulBookings, failedBookings, failedBookingsList } = response;

        if (successfulBookings > 0 && failedBookings === 0) {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `${successfulBookings} marcação(ões) realizadas com sucesso!` });
        } else if (successfulBookings > 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: `${successfulBookings} marcação(ões) realizadas, ${failedBookings} falharam.` });
            failedBookingsList.forEach((failed: FailedBooking) =>
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Aluno ${failed.studentId}: ${failed.errorMessage}` })
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: failedBookingsList.map((f: FailedBooking) => f.errorMessage).join(', ') || 'Falha ao processar marcações.' });
        }
    }

    // ── Template helpers ─────────────────────────────────────────────────────
    getStudentName(student: Student): string {
        console.log(student);
        if (student.user?.firstname && student.user?.lastname) return `${student.user.firstname} ${student.user.lastname}`;
        return student.user?.firstname || student.user?.lastname || 'Aluno';
    }

    getStudentEmail(student: Student): string {
        return student.user?.email || '';
    }

    getAvailableStudentName(student: AvailableStudent): string {
        return `${student.firstName} ${student.lastName}`;
    }

    getAvailableStudentEmail(student: AvailableStudent): string {
        return student.email || '';
    }

    getStudentInitials(student: Student): string {
        const f = student.user?.firstname?.[0] || '';
        const l = student.user?.lastname?.[0] || '';
        return (f + l).toUpperCase() || '?';
    }
}
