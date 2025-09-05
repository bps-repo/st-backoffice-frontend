import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {Student} from 'src/app/core/models/academic/student';
import {LessonService} from 'src/app/core/services/lesson.service';
import {StudentService} from 'src/app/core/services/student.service';
import {Subject, takeUntil} from 'rxjs';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {CardModule} from 'primeng/card';

@Component({
    selector: 'app-schedule-lessons',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, BadgeModule, CardModule],
    templateUrl: './schedule-lessons.component.html'
})
export class ScheduleLessonsComponent implements OnInit, OnDestroy {
    lessons: Lesson[] = [];
    filteredLessons: Lesson[] = [];
    selectedLesson: Lesson | null = null;

    // right panel
    enrolled: Student[] = [];
    available: Student[] = [];

    // local change tracking
    toAdd: string[] = [];
    toRemove: string[] = [];

    loadingLessons = false;
    loadingStudents = false;

    searchLessonsCtrl = this.fb.control('');
    searchStudentsCtrl = this.fb.control('');

    private destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly lessonApi: LessonService,
        private readonly studentApi: StudentService,
    ) {}

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
        this.loadingLessons = true;
        this.lessonApi.getAllLessons().pipe(takeUntil(this.destroy$)).subscribe({
            next: (lessons) => {
                this.lessons = lessons;
                this.filteredLessons = lessons;
                this.loadingLessons = false;
            },
            error: () => {
                this.loadingLessons = false;
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
        this.loadingStudents = true;
        // get existing bookings
        this.lessonApi.getLessonBookings(lessonId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (bookings) => {
                const bookedIds = bookings.map(b => b.studentId);
                // load all students then split
                this.studentApi.getStudents().pipe(takeUntil(this.destroy$)).subscribe({
                    next: (students) => {
                        const byId: Record<string, Student> = Object.fromEntries(students.map(s => [s.id!, s]));
                        this.enrolled = bookedIds.map((id: string) => byId[id]).filter(Boolean);
                        const enrolledSet = new Set(bookedIds);
                        this.available = students.filter(s => !enrolledSet.has(s.id!));
                        this.loadingStudents = false;
                    },
                    error: () => { this.loadingStudents = false; }
                });
            },
            error: () => { this.loadingStudents = false; }
        });
    }

    addStudent(student: Student) {
        if (!this.selectedLesson || !student.id) return;
        if (this.enrolled.find(s => s.id === student.id)) return;
        this.enrolled = [...this.enrolled, student];
        this.available = this.available.filter(s => s.id !== student.id);
        // record diff
        if (!this.toAdd.includes(student.id)) this.toAdd.push(student.id);
        // undo removal if toggled
        this.toRemove = this.toRemove.filter(id => id !== student.id);
    }

    removeStudent(student: Student) {
        if (!this.selectedLesson || !student.id) return;
        this.available = [student, ...this.available];
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
        const lessonId = this.selectedLesson.id;
        const requests: Promise<any>[] = [];

        // create bookings for toAdd
        for (const studentId of this.toAdd) {
            requests.push(this.lessonApi.createLessonBooking(lessonId, { studentId }).pipe(takeUntil(this.destroy$)).toPromise());
        }
        // delete bookings for toRemove
        for (const studentId of this.toRemove) {
            // backend expects bookingId; assuming bookingId == studentId for simplicity in mock; in real case, backend should send bookingId in getLessonBookings
            requests.push(this.lessonApi.deleteLessonBooking(lessonId, studentId).pipe(takeUntil(this.destroy$)).toPromise());
        }

        Promise.allSettled(requests).then(() => {
            this.toAdd = [];
            this.toRemove = [];
            if (this.selectedLesson?.id) this.loadLessonStudents(this.selectedLesson.id);
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
}


