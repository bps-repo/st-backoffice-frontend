import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {LessonApiService} from '../../../../../../core/services/lesson-api.service';
import {StudentService} from '../../../../../../core/services/student.service';
import {Lesson} from '../../../../../../core/models/academic/lesson';
import {Student} from '../../../../../../core/models/academic/student';

@Component({
    selector: 'app-book-lesson',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './book-lesson.component.html',
})
export class BookLessonComponent implements OnInit, OnDestroy {
    lessonId: string | null = null;
    studentId: string | null = null;
    lesson: Lesson | null = null;
    students: Student[] = [];
    bookingForm: FormGroup;
    loading = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private lessonService: LessonApiService,
        private studentService: StudentService,
        private messageService: MessageService
    ) {
        this.bookingForm = this.fb.group({
            selectedStudents: [[], Validators.required]
        });
    }

    ngOnInit(): void {
        // Get route parameters
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.lessonId = params['lessonId'];
            this.studentId = params['studentId'];

            // Load lesson details
            if (this.lessonId) {
                this.loadLesson(this.lessonId);
            }

            // Load students
            this.loadStudents();

            // If studentId is provided, preselect that student
            if (this.studentId && this.studentId !== '0') {
                this.bookingForm.patchValue({
                    selectedStudents: [this.studentId]
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadLesson(id: string): void {
        this.loading = true;
        this.lessonService.getLesson(id)
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

    loadStudents(): void {
        this.loading = true;
        this.studentService.getStudents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (students) => {
                    this.students = students;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading students:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load students'
                    });
                    this.loading = false;
                }
            });
    }

    bookLesson(): void {
        if (this.bookingForm.invalid || !this.lesson) {
            return;
        }

        this.loading = true;
        const selectedStudentIds = this.bookingForm.value.selectedStudents;

        // Get the selected students from the students array
        const selectedStudents = this.students.filter(student =>
            selectedStudentIds.includes(student.id)
        );

        // Add the selected students to the lesson's students array
        // If the lesson already has students, merge them
        const updatedStudents = [...(this.lesson.students || [])];

        // Add only students that aren't already in the lesson
        selectedStudents.forEach(student => {
            const existingIndex = updatedStudents.findIndex(s => s.id === student.id);
            if (existingIndex === -1) {
                updatedStudents.push({
                    id: student.id,
                    name: `${student.user.firstName} ${student.user.lastName}`,
                    email: student.user.email,
                    phone: student.user.identificationNumber || ''
                });
            }
        });

        // Update the lesson with the new students
        const updatedLesson: Lesson = {
            ...this.lesson,
            students: updatedStudents
        };

        this.lessonService.updateLesson(updatedLesson)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Students booked successfully'
                    });
                    this.loading = false;

                    // Navigate back to the lesson detail page after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/schoolar/lessons', this.lessonId]);
                    }, 1500);
                },
                error: (error) => {
                    console.error('Error booking lesson:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to book students for the lesson'
                    });
                    this.loading = false;
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/schoolar/lessons', this.lessonId]);
    }
}
