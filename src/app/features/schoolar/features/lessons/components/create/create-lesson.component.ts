import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
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
import {distinctUntilChanged, filter, Subject, takeUntil} from 'rxjs';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from "primeng/checkbox";
import {CardModule} from 'primeng/card';
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import {LevelActions} from "../../../../../../core/store/schoolar/level/level.actions";
import {CenterActions} from "../../../../../../core/store/corporate/center/centers.actions";
import {selectAllCenters} from "../../../../../../core/store/corporate/center/centers.selector";
import {selectAllLevels} from "../../../../../../core/store/schoolar/level/level.selector";
import {selectAllUnits} from "../../../../../../core/store/schoolar/units/unit.selectors";
import {selectAllClasses} from "../../../../../../core/store/schoolar/classes/classes.selectors";
import {ClassesActions} from "../../../../../../core/store/schoolar/classes/classesActions";
import {UnitActions} from "../../../../../../core/store/schoolar/units/unit.actions";

@Component({
    selector: 'app-create-lesson',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
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
    lessonForm!: FormGroup;
    private destroy$ = new Subject<void>();

    // Dropdown options
    typeOptions: SelectItem[] = [];
    levelOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    classOptions: SelectItem[] = [];
    unitOptions: SelectItem[] = [];
    statusOptions: SelectItem[] = [
        {label: 'Booked', value: LessonStatus.BOOKED},
        {label: 'Cancelled', value: LessonStatus.CANCELLED},
        {label: 'Completed', value: LessonStatus.COMPLETED}
    ];

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router,
        private messageService: MessageService
    ) {
        this.initializeForm();
    }

    ngOnInit() {
        this.store.dispatch(LevelActions.loadLevels())
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(ClassesActions.loadClasses())
        this.store.dispatch(UnitActions.loadUnits())
        this.initializeDropdownOptions();
        this.subscribeToStateChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForm(): void {
        this.lessonForm = this.fb.group({
            title: ['', [Validators.required]],
            teacherId: ['', [Validators.required]],
            levelId: ['', [Validators.required]],
            centerId: [''],
            classId: [''],
            unitId: [''],
            startDatetime: [new Date(), [Validators.required]],
            endDatetime: [new Date(), [Validators.required]],
            online: [false],
            onlineLink: [''],
            status: [LessonStatus.BOOKED],
            description: ['']
        });
    }

    private subscribeToStateChanges() {
        // Subscribe to centers data
        this.store.select(selectAllCenters)
            .pipe(takeUntil(this.destroy$))
            .subscribe(centers => {
                this.centerOptions = centers.map(center => ({
                    label: center.name,
                    value: center.id
                }));
            });

        // Subscribe to levels data
        this.store.select(selectAllLevels)
            .pipe(takeUntil(this.destroy$))
            .subscribe(levels => {
                this.levelOptions = levels.map(level => ({
                    label: level.name,
                    value: level.id
                }));
            });

        this.store.select(selectAllUnits)
            .pipe(takeUntil(this.destroy$))
            .subscribe(units => {
                this.unitOptions = units.map(unit => ({
                    label: unit.name,
                    value: unit.id
                }));
            });

        this.store.select(selectAllClasses)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classes => {
                this.classOptions = classes.map(clazz => ({
                    label: clazz.name,
                    value: clazz.id
                }));
            });
    }


    private initializeDropdownOptions(): void {
        this.typeOptions = [
            {label: 'VIP', value: 'VIP'},
            {label: 'Online', value: 'Online'},
            {label: 'In Center', value: 'In Center'}
        ];
    }

    cancel(): void {
        this.router.navigate(['/schoolar/lessons']);
    }

    saveLesson(): void {
        if (this.lessonForm.invalid) {
            this.markFormGroupTouched();
            this.showValidationErrors();
            return;
        }

        this.loading = true;

        // Create a complete lesson object from the form data
        const lessonToSave: Lesson = {
            ...this.lessonForm.value
        };

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({lesson: lessonToSave}));

        // Show success message and navigate to the lessons general
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Lesson created successfully'
        });

        this.loading = false;
        this.router.navigate(['/schoolar/lessons']);
    }

    private markFormGroupTouched(): void {
        Object.keys(this.lessonForm.controls).forEach(key => {
            const control = this.lessonForm.get(key);
            control?.markAsTouched();
        });
    }

    private showValidationErrors(): void {
        const errors: string[] = [];

        if (this.lessonForm.get('title')?.invalid) {
            errors.push('Title is required');
        }
        if (this.lessonForm.get('teacher')?.invalid) {
            errors.push('Teacher is required');
        }
        if (this.lessonForm.get('level')?.invalid) {
            errors.push('Level is required');
        }
        if (this.lessonForm.get('startDatetime')?.invalid) {
            errors.push('Start date/time is required');
        }
        if (this.lessonForm.get('endDatetime')?.invalid) {
            errors.push('End date/time is required');
        }

        errors.forEach(error => {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: error
            });
        });
    }

    resetForm(): void {
        this.lessonForm.reset({
            title: '',
            teacher: '',
            level: '',
            center: '',
            class: '',
            unit: '',
            startDatetime: new Date(),
            endDatetime: new Date(),
            online: false,
            onlineLink: '',
            status: LessonStatus.BOOKED,
            description: ''
        });
    }

    // Helper methods for template
    isFieldInvalid(fieldName: string): boolean {
        const field = this.lessonForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.lessonForm.get(fieldName);
        if (field && field.errors && (field.dirty || field.touched)) {
            if (field.errors['required']) {
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            }
        }
        return '';
    }
}
