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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { lessonsActions } from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import { CenterService } from 'src/app/core/services/center.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { UnitService } from 'src/app/core/services/unit.service';
import { LevelService } from 'src/app/core/services/level.service';
import { TooltipModule } from 'primeng/tooltip';

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
        CardModule,
        ProgressSpinnerModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './create-lesson.component.html'
})
export class CreateLessonComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    form!: FormGroup;
    private destroy$ = new Subject<void>();

    // Loading states for dropdowns
    loadingCenters: boolean = false;
    loadingLevels: boolean = false;
    loadingUnits: boolean = false;
    loadingTeachers: boolean = false;

    // Week range properties
    selectedWeekRange: Date[] = [];
    availableDays: Date[] = [];

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
    levelOptions: SelectItem[] = [];
    unitOptions: SelectItem[] = [];
    centerOptions: SelectItem[] = [];
    weekDayOptions: SelectItem[] = [];
    weekRangeOptions: SelectItem[] = [];
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
        private levelService: LevelService,
        private actions$: Actions
    ) { }

    ngOnInit() {
        // Set default times (9:00 AM for start, 10:00 AM for end)
        const defaultStartHour = new Date();
        defaultStartHour.setHours(9, 0, 0, 0);
        const defaultEndHour = new Date();
        defaultEndHour.setHours(10, 0, 0, 0);

        // Initialize week range with current week
        this.initializeWeekRange();

        // Build reactive form
        this.form = this.fb.group({
            title: ['', Validators.required],
            centerId: [null, Validators.required],
            weekRange: [null, Validators.required],
            selectedDay: [null, Validators.required],
            startDatetime: [defaultStartHour, Validators.required],
            endDatetime: [defaultEndHour, Validators.required],
            teacherId: [null, Validators.required],
            levelId: [null, Validators.required],
            unitId: [null, Validators.required],
            online: [false],
            onlineLink: ['http://sample.com'],
            status: [LessonStatus.AVAILABLE],
            description: ['']
        });

        // Listen for week range changes
        this.form.get('weekRange')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(weekRange => {
                if (weekRange && weekRange.length === 2) {
                    // Validate that the range is exactly 7 days
                    if (this.isValidWeekRange(weekRange)) {
                        this.selectedWeekRange = weekRange;
                        this.updateAvailableDays();
                        // Reset selected day when week range changes
                        this.form.get('selectedDay')?.setValue(null);
                    } else {
                        // Reset to invalid range
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: 'Por favor, selecione entre 1 e 7 dias (máximo uma semana)'
                        });
                        this.form.get('weekRange')?.setValue(null);
                    }
                }
            });

        // Load Centers
        this.loadingCenters = true;
        this.centerService.getAllCenters()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: centers => {
                    this.centerOptions = (centers || []).map(c => ({ label: c.name, value: c.id }));
                    this.loadingCenters = false;
                },
                error: () => {
                    this.centerOptions = [];
                    this.loadingCenters = false;
                }
            });

        // Load Teachers (employees with role TEACHER)
        this.loadingTeachers = true;
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
                    this.loadingTeachers = false;
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
                                this.loadingTeachers = false;
                            },
                            error: () => {
                                this.teacherOptions = [];
                                this.loadingTeachers = false;
                            }
                        });
                }
            });

        // Load Levels
        this.loadingLevels = true;
        this.levelService.getLevels()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: levels => {
                    this.levelOptions = (levels || []).map(l => ({ label: l.name, value: l.id }));
                    this.loadingLevels = false;
                },
                error: () => {
                    this.levelOptions = [];
                    this.loadingLevels = false;
                }
            });

        // Load Units (initially empty, will be filtered by selected level)
        this.unitOptions = [];

        // Listen for level changes to filter units
        this.form.get('levelId')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(levelId => {
                if (levelId) {
                    this.loadUnitsForLevel(levelId);
                } else {
                    this.unitOptions = [];
                    this.form.get('unitId')?.setValue(null);
                }
            });

        // Listen for selected day changes (no automatic range update)
        this.form.get('selectedDay')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(selectedDay => {
                // Just log the selection, no automatic range update
                console.log('Day selected:', selectedDay);
            });

        // Listen for start time changes to automatically update end time
        this.form.get('startDatetime')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(startTime => {
                if (startTime) {
                    this.updateEndTimeFromStartTime(startTime);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeWeekRange(): void {
        const today = new Date();
        const startOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
        endOfWeek.setHours(23, 59, 59, 999);

        this.selectedWeekRange = [startOfWeek, endOfWeek];
        this.form?.get('weekRange')?.setValue(this.selectedWeekRange);
        this.updateAvailableDays();
    }

    private updateAvailableDays(): void {
        if (this.selectedWeekRange.length !== 2) return;

        // Normalize the week range
        const normalizedRange = this.normalizeWeekRange(this.selectedWeekRange);
        const [startDate, endDate] = normalizedRange;

        this.availableDays = [];
        this.weekDayOptions = [];

        // Show all days in the selected range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            this.availableDays.push(new Date(currentDate));

            const dayName = this.getDayName(currentDate.getDay());
            this.weekDayOptions.push({
                label: dayName,
                value: new Date(currentDate)
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    private getDayName(dayIndex: number): string {
        const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return days[dayIndex];
    }

    private isValidWeekRange(weekRange: Date[]): boolean {
        if (!weekRange || weekRange.length !== 2) return false;

        const [startDate, endDate] = weekRange;
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Must be between 0 and 6 days difference (1 to 7 days total including both start and end)
        return diffDays >= 0 && diffDays <= 6;
    }

    private normalizeWeekRange(weekRange: Date[]): Date[] {
        if (!weekRange || weekRange.length !== 2) return weekRange;

        const [startDate, endDate] = weekRange;

        // Keep the original range but normalize times
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return [start, end];
    }


    private loadUnitsForLevel(levelId: string): void {
        this.loadingUnits = true;
        this.unitService.loadUnits()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: units => {
                    // Filter units by the selected level
                    const filteredUnits = (units || []).filter(u => u.levelId === levelId);
                    this.unitOptions = filteredUnits.map(u => ({ label: u.name, value: u.id }));

                    // Reset unit selection if current selection is not valid for the new level
                    const currentUnitId = this.form.get('unitId')?.value;
                    if (currentUnitId && !filteredUnits.some(u => u.id === currentUnitId)) {
                        this.form.get('unitId')?.setValue(null);
                    }
                    this.loadingUnits = false;
                },
                error: () => {
                    this.unitOptions = [];
                    this.loadingUnits = false;
                }
            });
    }

    cancel() {
        this.router.navigate(['/schoolar/lessons']).then();
    }

    private createDateTimeFromHour(hourDate: Date, selectedDay: Date): Date {
        // Create a copy of the selected day
        const result = new Date(selectedDay);

        // Set the time from the hour picker directly
        result.setHours(hourDate.getHours(), hourDate.getMinutes(), hourDate.getSeconds(), 0);

        // Add 1 hour to compensate for the timezone issue
        result.setHours(result.getHours() + 1);

        // Debug logs
        console.log('createDateTimeFromHour - Input hourDate:', hourDate);
        console.log('createDateTimeFromHour - Input selectedDay:', selectedDay);
        console.log('createDateTimeFromHour - Result (after +1h):', result);
        console.log('createDateTimeFromHour - Hour from hourDate:', hourDate.getHours());
        console.log('createDateTimeFromHour - Hour in result:', result.getHours());

        return result;
    }

    private updateEndTimeFromStartTime(startTime: Date): void {
        // Create a new date with start time + 1 hour
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        // Update the end time in the form
        this.form.get('endDatetime')?.setValue(endTime);

        console.log('Auto-updated end time:', endTime);
    }

    saveLesson() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, preencha todos os campos obrigatórios' });
            return;
        }

        // Additional validation for selected day
        if (!this.form.get('selectedDay')?.value) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecione um dia da semana' });
            return;
        }




        this.loading = true;

        const v = this.form.value as any;

        // Debug logs
        console.log('Form values:', v);
        console.log('startDatetime from form:', v.startDatetime);
        console.log('endDatetime from form:', v.endDatetime);
        console.log('selectedDay from form:', v.selectedDay);

        // Build API-compliant payload
        const startDateTime = this.createDateTimeFromHour(v.startDatetime, v.selectedDay);
        const endDateTime = this.createDateTimeFromHour(v.endDatetime, v.selectedDay);

        console.log('Final startDateTime:', startDateTime);
        console.log('Final endDateTime:', endDateTime);

        const payload: Lesson = {
            title: v.title || '',
            description: v.description || '',
            online: !!v.online,
            onlineLink: v.onlineLink,
            teacherId: v.teacherId,
            level: v.levelId, // Add level to the payload
            startDatetime: startDateTime,
            endDatetime: endDateTime,
            unitId: v.unitId,
            centerId: v.centerId,
            status: (v.status as any) ?? LessonStatus.AVAILABLE
        } as Lesson;

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({ lesson: payload }));

        // Wait for success or failure
        this.actions$.pipe(
            ofType(lessonsActions.createLessonSuccess),
            takeUntil(this.destroy$), take(1))
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

        // Reset week range to current week
        this.initializeWeekRange();

        this.form.reset({
            title: '',
            description: '',
            centerId: null,
            weekRange: this.selectedWeekRange,
            selectedDay: null,
            startDatetime: defaultStartHour,
            endDatetime: defaultEndHour,
            teacherId: null,
            levelId: null,
            unitId: null,
            online: false,
            onlineLink: '',
            status: LessonStatus.AVAILABLE
        });
    }

    onWeekRangeSelect(event: any) {
        // This method is called when the user selects a range in the calendar
        // The validation is already handled in the valueChanges subscription
        console.log("Week range selected:", event);
    }

    callMethod() {
        console.log("startDatetime", this.form.get('startDatetime')?.value);
        console.log("endDatetime", this.form.get('endDatetime')?.value);
    }
}
