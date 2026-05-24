import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { LessonCreate } from 'src/app/core/models/academic/lesson';
import { LessonStatus } from 'src/app/core/enums/lesson-status';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Employee } from 'src/app/core/models/corporate/employee';
import { Unit } from 'src/app/core/models/course/unit';
import { LessonType } from 'src/app/core/enums/lesson-type';
import { LessonService } from 'src/app/core/services/lessons/lesson.service';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { EmployeeService } from 'src/app/core/services/corporate/employee.service';
import { LessonsFacade } from 'src/app/core/services/lessons/lesson.facade';
import { CenterService } from 'src/app/core/services/center.service';
import { LevelService } from 'src/app/core/services/level.service';
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
        DatePickerModule,
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
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private lessonService = inject(LessonService);
    private teacherService = inject(EmployeeService);
    private lessonsFacade = inject(LessonsFacade);
    private centerService = inject(CenterService);
    private levelService = inject(LevelService);
    private unitService = inject(UnitService);

    loading = this.lessonsFacade.loading;
    error = this.lessonsFacade.error;

    form!: FormGroup;
    private destroy$ = new Subject<void>();
    private duplicateLessonToApply: Lesson | null = null;
    private allUnits: Unit[] = [];

    loadingCenters = signal(false);
    loadingLevels = signal(false);
    loadingUnits = false;
    loadingTeachers = signal(false);

    selectecGenericUnit: Unit | null = null;

    selectedWeekRange: Date[] = [];
    availableDays: Date[] = [];

    lesson: Partial<LessonCreate> = {
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

    typeOptions: SelectItem[] = [
        { label: 'Geral', value: LessonType.GENERAL },
        { label: 'Gramática', value: LessonType.GRAMMAR },
        { label: 'Vocabulário', value: LessonType.VOCABULARY },
        { label: 'Prática', value: LessonType.PRACTICAL },
        { label: 'Pronúncia', value: LessonType.PRONUNCIATION },
        { label: 'Escrita', value: LessonType.WRITING },
        { label: 'Leitura', value: LessonType.READING },
        { label: 'Conversa', value: LessonType.CONVERSATION },
        { label: 'Fala', value: LessonType.SPEAKING }
    ];
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

    ngOnInit() {
        const defaultStartHour = new Date();
        defaultStartHour.setHours(9, 0, 0, 0);
        const defaultEndHour = new Date();
        defaultEndHour.setHours(10, 0, 0, 0);

        this.initializeWeekRange();

        this.form = this.fb.group({
            title: ['', Validators.required],
            centerId: [null, Validators.required],
            weekRange: [null],
            selectedDay: [null, Validators.required],
            startDatetime: [defaultStartHour, Validators.required],
            endDatetime: [defaultEndHour, Validators.required],
            teacherId: [null, Validators.required],
            levelId: [null, Validators.required],
            unitId: [null],
            online: [false],
            type: [LessonType.GENERAL, [Validators.required]],
            onlineLink: ['http://sample.com'],
            status: [LessonStatus.AVAILABLE],
            description: ['']
        });

        this.form.get('weekRange')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(weekRange => {
                if (weekRange && weekRange.length === 2) {
                    if (this.isValidWeekRange(weekRange)) {
                        this.selectedWeekRange = weekRange;
                        this.updateAvailableDays();
                        this.form.get('selectedDay')?.setValue(null);
                    } else {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: 'Por favor, selecione entre 1 e 7 dias (máximo uma semana)'
                        });
                        this.form.get('weekRange')?.setValue(null);
                    }
                }
                this.updateConditionalDateValidators();
            });

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

        this.form.get('selectedDay')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.updateConditionalDateValidators());

        this.form.get('startDatetime')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(startTime => {
                if (startTime) {
                    this.updateEndTimeFromStartTime(startTime);
                }
            });

        this.loadCenters();
        this.loadLevels();
        this.loadTeachers();
        this.loadUnits();

        this.updateConditionalDateValidators();
        this.handleDuplicateFromQueryParam();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadCenters(): void {
        this.loadingCenters.set(true);
        this.centerService.getAllCenters()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: centers => {
                    this.centerOptions = centers.map(c => ({ label: c.name, value: c.id }));
                    this.loadingCenters.set(false);
                    this.tryApplyDuplicatePrefill();
                },
                error: () => {
                    this.centerOptions = [];
                    this.loadingCenters.set(false);
                }
            });
    }

    private loadLevels(): void {
        this.loadingLevels.set(true);
        this.levelService.getLevels()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: levels => {
                    this.levelOptions = levels.map((l: any) => ({ label: l.name, value: l.id }));
                    this.loadingLevels.set(false);
                    this.tryApplyDuplicatePrefill();
                },
                error: () => {
                    this.levelOptions = [];
                    this.loadingLevels.set(false);
                }
            });
    }

    private loadTeachers(): void {
        this.loadingTeachers.set(true);
        this.teacherService.getTeachers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (employees: Employee[]) => {
                    this.teacherOptions = employees.map((e: Employee) => {
                        const first = e.personalInfo.firstName || '';
                        const last = e.personalInfo.lastName || '';
                        const center = e.workInfo.centerName || '';
                        const label = `${first} ${last} - (${center})`.trim() || e.personalInfo?.email || e.id;
                        return { label, value: e.id };
                    });
                    this.loadingTeachers.set(false);
                    this.tryApplyDuplicatePrefill();
                },
                error: () => {
                    this.loadingTeachers.set(false);
                }
            });
    }

    private loadUnits(): void {
        this.unitService.loadUnits()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: units => {
                    this.allUnits = units;
                    const levelId = this.form.get('levelId')?.value;
                    if (levelId) {
                        this.loadUnitsForLevel(levelId);
                    }
                },
                error: () => {
                    this.allUnits = [];
                }
            });
    }

    private initializeWeekRange(): void {
        const today = new Date();
        const startOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        this.selectedWeekRange = [startOfWeek, endOfWeek];
        this.form?.get('weekRange')?.setValue(this.selectedWeekRange);
        this.updateAvailableDays();
    }

    private updateAvailableDays(): void {
        if (this.selectedWeekRange.length !== 2) return;

        const normalizedRange = this.normalizeWeekRange(this.selectedWeekRange);
        const [startDate, endDate] = normalizedRange;

        this.availableDays = [];
        this.weekDayOptions = [];

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            this.availableDays.push(new Date(currentDate));
            this.weekDayOptions.push({
                label: this.getDayName(currentDate.getDay()),
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

        return diffDays >= 0 && diffDays <= 6;
    }

    private normalizeWeekRange(weekRange: Date[]): Date[] {
        if (!weekRange || weekRange.length !== 2) return weekRange;

        const [startDate, endDate] = weekRange;

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        return [start, end];
    }

    private loadUnitsForLevel(levelId: string): void {
        const filtered = this.allUnits.filter(u => u.levelId === levelId && !u.generic);
        this.unitOptions = filtered.map(u => ({ label: u.name, value: u.id }));

        const currentUnitId = this.form.get('unitId')?.value;
        if (currentUnitId && !filtered.some(u => u.id === currentUnitId)) {
            this.form.get('unitId')?.setValue(null);
        }
    }

    private handleDuplicateFromQueryParam(): void {
        this.route.queryParamMap
            .pipe(takeUntil(this.destroy$), take(1))
            .subscribe((params) => {
                const sourceLessonId = params.get('duplicateFrom');
                if (!sourceLessonId) {
                    return;
                }

                this.lessonService.getLesson(sourceLessonId).pipe(take(1)).subscribe({
                    next: (lesson) => {
                        this.duplicateLessonToApply = lesson;
                        this.tryApplyDuplicatePrefill();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: 'Não foi possível carregar os dados da aula a duplicar.'
                        });
                    }
                });
            });
    }

    private tryApplyDuplicatePrefill(): void {
        if (!this.duplicateLessonToApply) {
            return;
        }

        if (!this.teacherOptions.length || !this.centerOptions.length || !this.levelOptions.length) {
            return;
        }

        this.prefillFormFromLesson(this.duplicateLessonToApply);
        this.duplicateLessonToApply = null;
    }

    private prefillFormFromLesson(lesson: Lesson): void {
        const lessonStart = new Date(lesson.startDatetime);
        const lessonEnd = new Date(lesson.endDatetime);
        const selectedDay = new Date(lessonStart);
        const weekRange = this.buildWeekRangeFromDate(selectedDay);

        const teacherId = this.resolveTeacherIdFromLesson(lesson);
        const centerId = this.resolveCenterIdFromLesson(lesson);
        const unitId = (lesson as any)?.unit?.id || null;
        const levelId = (lesson as any)?.unit?.levelId || (lesson as any)?.level || null;
        const type = this.resolveLessonTypeValue(lesson.type);

        this.form.patchValue({
            title: `${lesson.title} (cópia)`,
            description: lesson.description || '',
            centerId,
            weekRange,
            startDatetime: lessonStart,
            endDatetime: lessonEnd,
            teacherId,
            levelId,
            unitId,
            online: !!lesson.online,
            onlineLink: lesson.onlineLink || '',
            type,
            status: lesson.status || LessonStatus.AVAILABLE
        });

        const selectedDayOption = this.weekDayOptions.find(
            option => new Date(option.value).toDateString() === selectedDay.toDateString()
        );
        this.form.get('selectedDay')?.setValue(selectedDayOption?.value || selectedDay);
        this.updateConditionalDateValidators();

        this.messageService.add({
            severity: 'info',
            summary: 'Duplicação',
            detail: 'Dados da aula carregados. Ajuste se necessário e clique em criar.'
        });
    }

    private normalizeText(value: string): string {
        return (value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    private resolveTeacherIdFromLesson(lesson: Lesson): string | null {
        const directId = (lesson as any)?.teacher?.id;
        if (directId) {
            return directId;
        }

        const teacherName = this.normalizeText((lesson as any)?.teacher?.name || (lesson as any)?.teacher || '');
        if (!teacherName) {
            return null;
        }

        const matched = this.teacherOptions.find(option =>
            this.normalizeText(option.label || '').includes(teacherName)
        );
        return (matched?.value as string) || null;
    }

    private resolveCenterIdFromLesson(lesson: Lesson): string | null {
        const directId = (lesson as any)?.center?.id;
        if (directId) {
            return directId;
        }

        const centerName = this.normalizeText((lesson as any)?.center?.name || (lesson as any)?.center || '');
        if (!centerName) {
            return null;
        }

        const matched = this.centerOptions.find(option =>
            this.normalizeText(option.label || '') === centerName
        );
        return (matched?.value as string) || null;
    }

    private buildWeekRangeFromDate(referenceDate: Date): Date[] {
        const date = new Date(referenceDate);
        const dayOfWeek = date.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const start = new Date(date);
        start.setDate(date.getDate() + mondayOffset);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return [start, end];
    }

    private resolveLessonTypeValue(type: LessonType | string | number | undefined): LessonType {
        if (type === undefined || type === null) {
            return LessonType.GENERAL;
        }

        if (typeof type === 'number') {
            return type as LessonType;
        }

        if (typeof type === 'string') {
            const enumValue = (LessonType as any)[type.toUpperCase()];
            if (typeof enumValue === 'number') {
                return enumValue as LessonType;
            }
        }

        return LessonType.GENERAL;
    }

    private updateConditionalDateValidators(): void {
        const weekRangeControl = this.form.get('weekRange');
        const selectedDayControl = this.form.get('selectedDay');

        if (!weekRangeControl || !selectedDayControl) {
            return;
        }

        const hasSelectedDay = !!selectedDayControl.value;

        if (hasSelectedDay) {
            weekRangeControl.clearValidators();
        } else {
            weekRangeControl.setValidators([this.weekRangeRequiredWhenNoSelectedDay.bind(this)]);
        }

        weekRangeControl.updateValueAndValidity({ emitEvent: false });
        selectedDayControl.setValidators([Validators.required]);
        selectedDayControl.updateValueAndValidity({ emitEvent: false });
    }

    private hasWeekRange(control: AbstractControl): boolean {
        const value = control.value;
        return Array.isArray(value) && value.length === 2 && !!value[0] && !!value[1];
    }

    private weekRangeRequiredWhenNoSelectedDay(control: AbstractControl) {
        const selectedDay = this.form?.get('selectedDay')?.value;
        const hasRange = this.hasWeekRange(control);

        if (selectedDay || hasRange) {
            return null;
        }

        return { required: true };
    }

    cancel() {
        this.router.navigate(['/schoolar/lessons']).then();
    }

    private createDateTimeFromHour(hourDate: Date, selectedDay: Date): Date {
        const result = new Date(selectedDay);
        result.setHours(hourDate.getHours(), hourDate.getMinutes(), hourDate.getSeconds(), 0);
        result.setHours(result.getHours() + 1);
        return result;
    }

    private updateEndTimeFromStartTime(startTime: Date): void {
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
        this.form.get('endDatetime')?.setValue(endTime);
    }

    async saveLesson() {
        this.updateConditionalDateValidators();

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, preencha todos os campos obrigatórios'
            });
            return;
        }

        if (!this.form.get('selectedDay')?.value) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, selecione um dia da semana'
            });
            return;
        }

        const v = this.form.value as any;

        this.resolveGenericUnit(v.levelId);

        const startDateTime = this.createDateTimeFromHour(v.startDatetime, v.selectedDay);
        const endDateTime = this.createDateTimeFromHour(v.endDatetime, v.selectedDay);

        const payload: LessonCreate = {
            title: v.title || '',
            description: v.description || '',
            online: !!v.online,
            onlineLink: v.onlineLink,
            teacherId: v.teacherId,
            level: v.levelId,
            startDatetime: startDateTime,
            endDatetime: endDateTime,
            unitId: v.unitId ? v.unitId : this.selectecGenericUnit?.id,
            centerId: v.centerId,
            type: v.type,
            status: LessonStatus.AVAILABLE
        } as LessonCreate;

        await this.lessonsFacade.createLesson(payload);

        if (this.error()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao criar aula',
                detail: this.error()!
            });
            return;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Aula criada com sucesso'
        });

        this.router.navigate(['/schoolar/lessons']);
    }

    resetForm() {
        const defaultStartHour = new Date();
        defaultStartHour.setHours(9, 0, 0, 0);
        const defaultEndHour = new Date();
        defaultEndHour.setHours(10, 0, 0, 0);

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

    onWeekRangeSelect(_event: any) {}

    callMethod() {}

    private resolveGenericUnit(levelId: string): void {
        this.selectecGenericUnit = this.allUnits.find(u => u.levelId === levelId && u.generic) ?? null;
    }
}
