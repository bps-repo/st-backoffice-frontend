import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {Store} from '@ngrx/store';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {LessonStatus} from 'src/app/core/enums/lesson-status';
import {Router} from '@angular/router';
import {distinctUntilChanged, Observable, Subject, takeUntil} from 'rxjs';
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
import {EmployeeActions} from "../../../../../../core/store/corporate/employees/employee.actions";
import * as EmployeeSelectors from "../../../../../../core/store/corporate/employees/employees.selector";
import {Employee} from "../../../../../../core/models/corporate/employee";
import * as LessonSelectors from "../../../../../../core/store/schoolar/lessons/lessons.selectors";

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
    loading$!: Observable<boolean>
    errors$!: Observable<any>
    createSuccess$!: Observable<boolean>
    lessonForm!: FormGroup;
    private destroy$ = new Subject<void>();

    // Dropdown options
    levelOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    classOptions: SelectItem[] = [];
    unitOptions: SelectItem[] = [];
    teacherOptions: SelectItem[] = [];
    statusOptions: SelectItem[] = [
        {label: 'Disponivel', value: LessonStatus.AVAILABLE},
        {label: 'Indisponivel', value: LessonStatus.AVAILABLE}
    ];

    // Store all data for filtering
    private allClasses: any[] = [];
    private allTeachers: Employee[] = [];

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router,
        private messageService: MessageService
    ) {
        this.loading$ = this.store.select(LessonSelectors.selectLoadingCreate)
        this.errors$ = this.store.select(LessonSelectors.selectAnyError)
        this.createSuccess$ = this.store.select(LessonSelectors.selectCreateLessonSuccess)
        this.initializeForm();
    }

    ngOnInit() {
        this.store.dispatch(LevelActions.loadLevels())
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(ClassesActions.loadClasses())
        this.store.dispatch(UnitActions.loadUnits())
        this.store.dispatch(EmployeeActions.loadEmployees()) // Load teachers
        this.initializeDropdownOptions();
        this.subscribeToStateChanges();
        this.setupCenterChangeListener();
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
            centerId: ['', [Validators.required]], // Make center required
            classId: ['', [Validators.required]],
            unitId: ['', [Validators.required]],
            startDatetime: [new Date(), [Validators.required]],
            endDatetime: [new Date(), [Validators.required]],
            online: [false, [Validators.required]],
            onlineLink: ['https://main.d2s2k4iauh5ooc.amplifyapp.com/'],
            status: [LessonStatus.AVAILABLE],
            description: ['']
        });
    }

    private setupCenterChangeListener(): void {
        // Listen for center changes and update dependent dropdowns
        this.lessonForm.get('centerId')?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe(centerId => {
                this.onCenterChange(centerId);
            });
    }

    private onCenterChange(centerId: string): void {
        if (centerId) {
            // Filter classes by center
            this.classOptions = this.allClasses
                .filter(clazz => clazz.centerId === centerId)
                .map(clazz => ({
                    label: clazz.name,
                    value: clazz.id
                }));

            // Filter teachers by center
            this.teacherOptions = this.allTeachers
                .filter(teacher => teacher.centerId === centerId)
                .map(teacher => ({
                    label: `${teacher.user.firstname} ${teacher.user.lastname}`,
                    value: teacher.id
                }));
        } else {
            this.classOptions = [];
            this.teacherOptions = [];
        }

        // Reset dependent form controls when center changes
        this.lessonForm.patchValue({
            classId: '',
            teacherId: ''
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

        // Subscribe to units data
        this.store.select(selectAllUnits)
            .pipe(takeUntil(this.destroy$))
            .subscribe(units => {
                this.unitOptions = units.map(unit => ({
                    label: unit.name,
                    value: unit.id
                }));
            });

        // Subscribe to classes data and store all classes
        this.store.select(selectAllClasses)
            .pipe(takeUntil(this.destroy$))
            .subscribe(classes => {
                this.allClasses = classes;
                // If a center is already selected, filter the classes
                const selectedCenterId = this.lessonForm.get('centerId')?.value;
                if (selectedCenterId) {
                    this.onCenterChange(selectedCenterId);
                }
            });

        this.store.select(EmployeeSelectors.selectAllEmployees)
            .pipe(takeUntil(this.destroy$))
            .subscribe(teachers => {
                this.allTeachers = teachers;
                // If a center is already selected, filter the teachers
                const selectedCenterId = this.lessonForm.get('centerId')?.value;
                if (selectedCenterId) {
                    this.onCenterChange(selectedCenterId);
                }
            });

        this.createSuccess$.pipe(takeUntil(this.destroy$))
            .subscribe((s) => {
                if (s) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lesson created successfully'
                    });
                }
            })


        this.errors$.pipe(takeUntil(this.destroy$))
            .subscribe((s) => {
                if (s) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: s
                    });
                }
            })
    }

    private initializeDropdownOptions(): void {
    }

    cancel(): void {
        this.router.navigate(['/schoolar/lessons']).then();
    }

    private toLocalISOString(date: Date): string {
        return date.getFullYear() +
            '-' + String(date.getMonth() + 1).padStart(2, '0') +
            '-' + String(date.getDate()).padStart(2, '0') + 'T' +
            String(date.getHours()).padStart(2, '0') + ':' +
            String(date.getMinutes()).padStart(2, '0') + ':' +
            String(date.getSeconds()).padStart(2, '0');
    }

    saveLesson(): void {
        if (this.lessonForm.invalid) {
            this.markFormGroupTouched();
            this.showValidationErrors();
            return;
        }


        // Create a complete lesson object from the form data
        const start = this.lessonForm.get('startDatetime')?.value;
        const end = this.lessonForm.get('endDatetime')?.value;


        const lessonToSave: Lesson = {
            ...this.lessonForm.value,
            startDatetime: this.toLocalISOString(new Date(start)),
            endDatetime: this.toLocalISOString(new Date(end)),
        };

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({lesson: lessonToSave}));
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
        if (this.lessonForm.get('teacherId')?.invalid) {
            errors.push('Teacher is required');
        }
        if (this.lessonForm.get('levelId')?.invalid) {
            errors.push('Level is required');
        }
        if (this.lessonForm.get('centerId')?.invalid) {
            errors.push('Center is required');
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
            teacherId: '',
            levelId: '',
            centerId: '',
            classId: '',
            unitId: '',
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
