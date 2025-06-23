import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {LEVELS, INSTALATIONS} from 'src/app/shared/constants/app';
import {Store} from '@ngrx/store';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {LessonStatus} from 'src/app/core/enums/lesson-status';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from "primeng/checkbox";
import {CardModule} from 'primeng/card';
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";

@Component({
    selector: 'app-create-lesson',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        CalendarModule,
        ToastModule,
        CheckboxModule,
        CardModule
    ],
    providers: [MessageService],
    templateUrl: './create-lesson.component.html'
})
export class CreateLessonComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    private destroy$ = new Subject<void>();

    lesson: Partial<Lesson> = {
        title: '',
        description: '',
        teacher: '',
        level: '',
        students: [],
        online: false,
        startDatetime: new Date(),
        endDatetime: new Date(),
        status: LessonStatus.BOOKED
    };

    // Dropdown options
    typeOptions: SelectItem[] = [];
    levelOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    statusOptions: SelectItem[] = [
        {label: 'Booked', value: LessonStatus.BOOKED},
        {label: 'Cancelled', value: LessonStatus.CANCELLED},
        {label: 'Completed', value: LessonStatus.COMPLETED}
    ];

    constructor(
        private store: Store,
        private router: Router,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        // Initialize dropdown options
        this.typeOptions = [
            {label: 'VIP', value: 'VIP'},
            {label: 'Online', value: 'Online'},
            {label: 'In Center', value: 'In Center'}
        ];

        this.levelOptions = LEVELS.map(level => ({
            label: level.label,
            value: level.value
        }));

        this.centerOptions = INSTALATIONS.map(center => ({
            label: center,
            value: center
        }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    cancel() {
        this.router.navigate(['/schoolar/lessons']);
    }

    saveLesson() {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;

        // Create a complete lesson object from the form data
        const lessonToSave: Lesson = {
            ...this.lesson as Lesson
        };

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({lesson: lessonToSave}));

        // Show success message and navigate to the lessons list
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Lesson created successfully'
        });

        this.loading = false;
        this.router.navigate(['/schoolar/lessons']);
    }

    validateForm(): boolean {
        if (!this.lesson.title) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Title is required'
            });
            return false;
        }

        if (!this.lesson.teacher) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Teacher is required'
            });
            return false;
        }

        if (!this.lesson.level) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Level is required'
            });
            return false;
        }

        if (!this.lesson.startDatetime) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Start date/time is required'
            });
            return false;
        }

        if (!this.lesson.endDatetime) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End date/time is required'
            });
            return false;
        }

        return true;
    }

    resetForm() {
        this.lesson = {
            title: '',
            description: '',
            teacher: '',
            level: '',
            students: [],
            online: false,
            startDatetime: new Date(),
            endDatetime: new Date(),
            status: LessonStatus.BOOKED
        };
    }
}
