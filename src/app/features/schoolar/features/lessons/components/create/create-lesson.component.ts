import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { Store } from '@ngrx/store';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { LessonStatus } from 'src/app/core/enums/lesson-status';
import { Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Actions, ofType } from '@ngrx/effects';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from 'primeng/card';
import { lessonsActions } from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import { CenterService } from 'src/app/core/services/center.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UnitService } from 'src/app/core/services/unit.service';

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
    form!: FormGroup;
    private destroy$ = new Subject<void>();

    lesson: Partial<Lesson> = {
        title: '',
        description: '',
        teacherId: '',
        level: '',
        students: [],
        online: false,
        onlineLink: '',
        unitId: undefined,
        centerId: undefined,
        startDatetime: new Date(),
        endDatetime: new Date(),
        status: LessonStatus.AVAILABLE
    };

    // Dropdown options
    typeOptions: SelectItem[] = [];
    teacherOptions: SelectItem[] = [];
    unitOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    weekDayOptions: SelectItem[] = [
        { label: 'Segunda-feira', value: 1 },
        { label: 'Terça-feira', value: 2 },
        { label: 'Quarta-feira', value: 3 },
        { label: 'Quinta-feira', value: 4 },
        { label: 'Sexta-feira', value: 5 },
        { label: 'Sábado', value: 6 }
    ];
    statusOptions: SelectItem[] = [
        { label: 'Available', value: LessonStatus.AVAILABLE },
        { label: 'Booked', value: LessonStatus.BOOKED },
        { label: 'Cancelled', value: LessonStatus.CANCELLED },
        { label: 'Completed', value: LessonStatus.COMPLETED }
    ];

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router,
        private messageService: MessageService,
        private centerService: CenterService,
        private employeeService: EmployeeService,
        private unitService: UnitService,
        private actions$: Actions
    ) { }

    ngOnInit() {
        // Set default times (9:00 AM for start, 10:00 AM for end)
        const defaultStartHour = new Date();
        defaultStartHour.setHours(9, 0, 0, 0);
        const defaultEndHour = new Date();
        defaultEndHour.setHours(10, 0, 0, 0);

        // Get today's weekday (1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday)
        const today = new Date();
        let todayWeekday = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        // Convert to our format (1=Monday, ..., 6=Saturday)
        if (todayWeekday === 0) todayWeekday = 7; // Sunday becomes 7
        // If today is Sunday, default to Monday (1)
        const defaultWeekday = todayWeekday <= 6 ? todayWeekday : 1;

        // Build reactive form
        this.form = this.fb.group({
            title: ['', Validators.required],
            centerId: [null, Validators.required],
            weekDay: [defaultWeekday, Validators.required],
            startDatetime: [defaultStartHour, Validators.required],
            endDatetime: [defaultEndHour, Validators.required],
            teacherId: [null, Validators.required],
            unitId: [null, Validators.required],
            online: [false],
            onlineLink: ['http://sample.com'],
            status: [LessonStatus.AVAILABLE],
            description: ['']
        });

        // Load Centers
        this.centerService.getAllCenters()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: centers => {
                    this.centerOptions = (centers || []).map(c => ({ label: c.name, value: c.id }));
                },
                error: () => {
                    this.centerOptions = [];
                }
            });

        // Load Teachers (employees with role TEACHER)
        this.employeeService.getEmployeesByRole('TEACHER')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: employees => {
                    this.teacherOptions = employees.map((e: any) => {
                        const first = e?.user?.firstname || e?.firstname || '';
                        const last = e?.user?.lastname || e?.lastname || '';
                        const label = `${first} ${last}`.trim() || e?.user?.email || e.id;
                        return { label, value: e.id };
                    });
                },
                error: () => {
                    // Fallback: load all employees and filter client-side by role
                    this.employeeService.getEmployees()
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (all: any[]) => {
                                const onlyTeachers = (all || []).filter((e: any) => {
                                    const roles = e?.roles || e?.user?.roles || [];
                                    return Array.isArray(roles) && roles.some((r: any) => (r?.name || r) === 'TEACHER');
                                });
                                this.teacherOptions = onlyTeachers.map((e: any) => {
                                    const first = e?.user?.firstname || e?.firstname || '';
                                    const last = e?.user?.lastname || e?.lastname || '';
                                    const label = `${first} ${last}`.trim() || e?.user?.email || e.id;
                                    return { label, value: e.id };
                                });
                            },
                            error: () => {
                                this.teacherOptions = [];
                            }
                        });
                }
            });

        // Load Units
        this.unitService.loadUnits()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: units => {
                    this.unitOptions = (units || []).map(u => ({ label: u.name, value: u.id }));
                },
                error: () => {
                    this.unitOptions = [];
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    cancel() {
        this.router.navigate(['/schoolar/lessons']).then();
    }

    private formatDateTime(dt: string | Date | undefined): string | undefined {
        if (!dt) return undefined;
        const d = typeof dt === 'string' ? new Date(dt) : dt;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    private createDateTimeFromHour(hourDate: Date, selectedWeekDay: number): Date {
        const today = new Date();
        const currentWeekday = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday (0) to 7

        // Calculate the difference in days to the selected weekday
        const dayDifference = selectedWeekDay - currentWeekday;

        // Create the target date
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayDifference);

        // Set the time from the hour picker
        const result = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(),
                              hourDate.getHours(), hourDate.getMinutes(), hourDate.getSeconds());
        return result;
    }

    saveLesson() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
            return;
        }

        this.loading = true;

        const v = this.form.value as any;

        // Build API-compliant payload
        const payload: Lesson = {
            title: v.title || '',
            description: v.description || '',
            online: !!v.online,
            onlineLink: v.online ? (v.onlineLink || '') : '',
            teacherId: v.teacherId,
            startDatetime: this.createDateTimeFromHour(v.startDatetime, v.weekDay),
            endDatetime: this.createDateTimeFromHour(v.endDatetime, v.weekDay),
            unitId: v.unitId,
            centerId: v.centerId,
            status: (v.status as any) ?? LessonStatus.AVAILABLE
        } as Lesson;

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({ lesson: payload }));

        // Wait for success or failure
        this.actions$.pipe(ofType(lessonsActions.createLessonSuccess), takeUntil(this.destroy$), take(1))
            .subscribe(() => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Aula criada com sucesso'
                });
                this.router.navigate(['/schoolar/lessons']).then();
            });
        this.actions$.pipe(ofType(lessonsActions.createLessonFailure), takeUntil(this.destroy$), take(1))
            .subscribe(({ error }: any) => {
                this.loading = false;
                // Show backend error(s). Split combined message to multiple toasts if needed
                const messages = (error || '').toString().split(' | ').filter((m: string) => !!m);
                if (messages.length === 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create lesson' });
                } else {
                    messages.forEach((msg: string) => this.messageService.add({ severity: 'error', summary: 'Error', detail: msg }));
                }
            });
    }

    resetForm() {
        // Set default times (9:00 AM for start, 10:00 AM for end)
        const defaultStartHour = new Date();
        defaultStartHour.setHours(9, 0, 0, 0);
        const defaultEndHour = new Date();
        defaultEndHour.setHours(10, 0, 0, 0);

        // Get today's weekday (1=Monday, 2=Tuesday, ..., 6=Saturday, 0=Sunday)
        const today = new Date();
        let todayWeekday = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        // Convert to our format (1=Monday, ..., 6=Saturday)
        if (todayWeekday === 0) todayWeekday = 7; // Sunday becomes 7
        // If today is Sunday, default to Monday (1)
        const defaultWeekday = todayWeekday <= 6 ? todayWeekday : 1;

        this.form.reset({
            title: '',
            description: '',
            centerId: null,
            weekDay: defaultWeekday,
            startDatetime: defaultStartHour,
            endDatetime: defaultEndHour,
            teacherId: null,
            unitId: null,
            online: false,
            onlineLink: '',
            status: LessonStatus.AVAILABLE
        });
    }
}
