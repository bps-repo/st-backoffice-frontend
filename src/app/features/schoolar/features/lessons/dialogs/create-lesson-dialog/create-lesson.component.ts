import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
import {Subject, takeUntil} from 'rxjs';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from "primeng/checkbox";
import {CardModule} from 'primeng/card';
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import {CenterService} from 'src/app/core/services/center.service';
import {EmployeeService} from 'src/app/core/services/employee.service';
import {UnitService} from 'src/app/core/services/unit.service';

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
        onlineLink: '',
        // IDs expected by API; UI may later provide selectors for these
        teacherId: undefined,
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
    statusOptions: SelectItem[] = [
        {label: 'Available', value: LessonStatus.AVAILABLE},
        {label: 'Booked', value: LessonStatus.BOOKED},
        {label: 'Cancelled', value: LessonStatus.CANCELLED},
        {label: 'Completed', value: LessonStatus.COMPLETED}
    ];

    constructor(
        private store: Store,
        private router: Router,
        private messageService: MessageService,
        private centerService: CenterService,
        private employeeService: EmployeeService,
        private unitService: UnitService
    ) {
    }

    ngOnInit() {
        // Optional type options (kept for potential future use)
        this.typeOptions = [
            {label: 'VIP', value: 'VIP'},
            {label: 'Online', value: 'Online'},
            {label: 'In Center', value: 'In Center'}
        ];

        // Load Centers
        this.centerService.getAllCenters()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: centers => {
                    this.centerOptions = (centers || []).map(c => ({label: c.name, value: c.id}));
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
                    this.teacherOptions = (employees || []).map((e: any) => {
                        const first = e?.user?.firstname || e?.firstname || '';
                        const last = e?.user?.lastname || e?.lastname || '';
                        const label = `${first} ${last}`.trim() || e?.user?.email || e.id;
                        return {label, value: e.id};
                    });
                },
                error: () => {
                    this.teacherOptions = [];
                }
            });

        // Load Units
        this.unitService.loadUnits()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: units => {
                    this.unitOptions = (units || []).map(u => ({label: u.name, value: u.id}));
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
        this.router.navigate(['/schoolar/lessons']);
    }

    private formatDateTime(dt: string | Date | undefined): string | undefined {
        if (!dt) return undefined;
        const d = typeof dt === 'string' ? new Date(dt) : dt;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    saveLesson() {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;

        // Build API-compliant payload
        const payload: Lesson = {
            title: this.lesson.title || '',
            description: this.lesson.description || '',
            online: !!this.lesson.online,
            onlineLink: this.lesson.online ? (this.lesson.onlineLink || '') : '',
            teacherId: (this.lesson as any).teacherId,
            startDatetime: this.formatDateTime(this.lesson.startDatetime) as string,
            endDatetime: this.formatDateTime(this.lesson.endDatetime) as string,
            unitId: (this.lesson as any).unitId,
            centerId: (this.lesson as any).centerId,
            status: (this.lesson.status as any) ?? LessonStatus.AVAILABLE
        } as Lesson;

        // Dispatch the create lesson action
        this.store.dispatch(lessonsActions.createLesson({lesson: payload}));

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

        if (!(this.lesson as any).teacherId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Teacher is required'
            });
            return false;
        }

        if (!(this.lesson as any).unitId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unit is required'
            });
            return false;
        }

        if (!(this.lesson as any).centerId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Center is required'
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
