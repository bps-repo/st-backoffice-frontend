import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { Student } from 'src/app/core/models/academic/students/student';
import { AvailableStudent } from 'src/app/core/models/academic/available-student';
import { BulkBookingRequest, BulkBookingResult, FailedBooking } from 'src/app/core/models/academic/bulk-booking';
import { LessonService } from 'src/app/core/services/lesson.service';
import { StudentService } from 'src/app/core/services/student.service';
import { LevelService } from 'src/app/core/services/level.service';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { Store } from '@ngrx/store';
import * as LessonActions from 'src/app/core/store/schoolar/lessons/lessons.actions';
import * as StudentActions from 'src/app/core/store/schoolar/students/students.actions';
import { selectAllLessons, selectLessonBookings } from 'src/app/core/store/schoolar/lessons/lessons.selectors';
import { selectAllStudents } from 'src/app/core/store/schoolar/students/students.selectors';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
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
        CardModule, ProgressSpinnerModule, ScrollPanelModule, ToastModule, DropdownModule, TooltipModule
    ],
    templateUrl: './schedule-lessons.component.html'
})
export class ScheduleLessonsComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly lessonApi = inject(LessonService);
    private readonly studentApi = inject(StudentService);
    private readonly levelService = inject(LevelService);
    private readonly store = inject(Store);
    private readonly messageService = inject(MessageService);
    private readonly route = inject(ActivatedRoute);

    // ── Mode ────────────────────────────────────────────────────────────────
    mode = signal<ScheduleMode>('lesson-to-students');

    // ── Lesson-to-Students state ─────────────────────────────────────────────
    lessons: Lesson[] = [];
    filteredLessons: Lesson[] = [];
    selectedLesson: Lesson | null = null;

    enrolled: Student[] = [];
    available: AvailableStudent[] = [];

    toAdd: string[] = [];
    toRemove: string[] = [];

    loadingLessons = signal(false);
    loadingStudents = signal(false);
    savingChanges = signal(false);

    searchLessonsCtrl = this.fb.control('');
    levelFilterCtrl = this.fb.control(null);

    levelOptions: SelectItem[] = [];
    loadingLevels = signal(false);

    // ── Student-to-Lessons state ─────────────────────────────────────────────
    students: Student[] = [];
    filteredStudents: Student[] = [];
    selectedStudent: Student | null = null;

    availableLessonsForStudent: Lesson[] = [];
    lessonsToEnroll: Lesson[] = [];

    loadingStudentsList = signal(false);
    loadingAvailableLessons = signal(false);
    savingStudentLessons = signal(false);

    searchStudentsListCtrl = this.fb.control('');

    // ── Shared ────────────────────────────────────────────────────────────────
    searchStudentsCtrl = this.fb.control('');

    private destroy$ = new Subject<void>();

    constructor() {
        this.store.dispatch(LessonActions.lessonsActions.loadLessons());
        this.store.dispatch(StudentActions.StudentsActions.loadStudents());
    }

    ngOnInit(): void {
        this.loadLessons();
        this.loadStudentsFromStore();
        this.loadLevels();

        this.searchLessonsCtrl.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((term) => this.applyLessonFilter(String(term || '')));
        this.searchStudentsCtrl.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((term) => this.applyStudentsFilter(String(term || '')));
        this.levelFilterCtrl.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((levelId) => this.applyLevelFilter(levelId));
        this.searchStudentsListCtrl.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((term) => this.applyStudentListFilter(String(term || '')));

        // Auto-select lesson from query param (lesson-to-students flow)
        const preselectedLessonId = this.route.snapshot.queryParamMap.get('lessonId');
        if (preselectedLessonId) {
            this.store.select(selectAllLessons).pipe(
                takeUntil(this.destroy$),
                filter((l) => l != null && l.length > 0),
                map((l) => l!.find(x => x.id === preselectedLessonId) ?? null),
                filter((lesson): lesson is Lesson => lesson !== null),
            ).subscribe((lesson) => this.selectLesson(lesson));
        }

        // Auto-select student from query param (student-to-lessons flow)
        const preselectedStudentId = this.route.snapshot.queryParamMap.get('studentId');
        if (preselectedStudentId) {
            this.mode.set('student-to-lessons');
            this.store.select(selectAllStudents).pipe(
                takeUntil(this.destroy$),
                filter((s) => s != null && s.length > 0),
                map((s) => s!.find(x => x.id === preselectedStudentId) ?? null),
                filter((student): student is Student => student !== null),
            ).subscribe((student) => this.selectStudent(student));
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
        this.loadingLessons.set(true);
        this.store.select(selectAllLessons).pipe(
            takeUntil(this.destroy$),
            filter((lessons) => lessons !== null),
            map((lessons) => lessons!.filter((l) => l.status === LessonStatus.AVAILABLE)),
        ).subscribe({
            next: (lessons) => {
                this.lessons = lessons as Lesson[];
                this.filteredLessons = lessons;
                this.loadingLessons.set(false);
            },
            error: () => this.loadingLessons.set(false)
        });
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

                this.store.select(selectLessonBookings).pipe(takeUntil(this.destroy$)).subscribe({
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
            levelName: student.level.name,
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
    private loadStudentsFromStore(): void {
        this.loadingStudentsList.set(true);
        this.store.select(selectAllStudents).pipe(
            takeUntil(this.destroy$),
            filter((s) => s !== null),
        ).subscribe({
            next: (students) => {
                this.students = students as Student[];
                this.filteredStudents = students as Student[];
                this.loadingStudentsList.set(false);
            },
            error: () => this.loadingStudentsList.set(false)
        });
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

    private applyLessonFilter(term: string): void {
        this.applyFilters(term, this.levelFilterCtrl.value);
    }

    private applyLevelFilter(levelId: string | null): void {
        this.applyFilters(this.searchLessonsCtrl.value || '', levelId);
    }

    private applyFilters(searchTerm: string, levelId: string | null): void {
        const term = searchTerm.toLowerCase();
        this.filteredLessons = this.lessons.filter(l => {
            const matchesSearch = (l.title || '').toLowerCase().includes(term) || (l.teacher?.name || '').toLowerCase().includes(term);
            const matchesLevel = !levelId || l.unit?.levelId === levelId;
            return matchesSearch && matchesLevel;
        });
    }

    private applyStudentListFilter(term: string): void {
        const t = term.toLowerCase();
        this.filteredStudents = this.students.filter(s => {
            const name = `${s.user?.firstname || ''} ${s.user?.lastname || ''}`.toLowerCase();
            const email = (s.user?.email || '').toLowerCase();
            return name.includes(t) || email.includes(t);
        });
    }

    private applyStudentsFilter(_term: string): void {
        // reserved for right-panel student search
    }

    // ── Template helpers ─────────────────────────────────────────────────────
    getStudentName(student: Student): string {
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
