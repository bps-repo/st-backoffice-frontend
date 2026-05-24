import {CommonModule} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    inject
} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {LessonStatus} from 'src/app/core/enums/lesson-status';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SelectItem} from 'primeng/api';
import {LEVELS} from 'src/app/shared/constants/app';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Router, RouterModule} from '@angular/router';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {RippleModule} from "primeng/ripple";
import {SelectButtonModule} from 'primeng/selectbutton';
import {TooltipModule} from 'primeng/tooltip';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LESSON_COLUMNS, LESSONS_GLOBAL_FILTER_FIELDS} from "./lessons.constants";
import {LessonReports} from "../../../reports/components/lessons/lesson-reports.component";
import {CalendarModule} from 'primeng/calendar';
import {BadgeModule} from 'primeng/badge';
import {HasPermissionDirective} from 'src/app/shared/directives/has-permission.directive';
import {LessonService} from "../../../../../../core/services/lessons/lesson.service";
import {EmployeeService} from "../../../../../../core/services/corporate/employee.service";
import {CenterService} from "../../../../../../core/services/center.service";
import {LevelService} from "../../../../../../core/services/level.service";
import {UnitService} from "../../../../../../core/services/unit.service";
import {KpiIndicatorsComponent, Kpi} from "../../../../../../shared/kpi-indicator/kpi-indicator.component";
import {LessonStatusLabelPipe} from "../../../../../../shared/pipes/lesson-status-label.pipe";
import {LessonStatusSeverityPipe} from "../../../../../../shared/pipes/lesson-status-severity.pipe";
import {LessonStatusClassPipe} from "../../../../../../shared/pipes/lesson-status-class.pipe";
import {TagModule} from 'primeng/tag';
import { LessonsDashboardComponent } from "../../../dashboard/components/lessons/lessons-dashboard.component";

interface WeeklyLessonCard {
    time: string;
    title: string;
    teacher: string;
    group: string;
    status: string;
    statusClass: string;
    lesson: Lesson;
}

interface WeeklyLessonDay {
    day: string;
    date: string;
    dayKey?: string;
    isToday: boolean;
    classes: WeeklyLessonCard[];
}

@Component({
    selector: 'app-lessons',
    imports: [
    GlobalTable,
    DialogModule,
    ToastModule,
    CommonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    ChartModule,
    CardModule,
    RippleModule,
    SelectButtonModule,
    TooltipModule,
    LessonReports,
    CalendarModule,
    BadgeModule,
    HasPermissionDirective,
    InputSwitchModule,
    KpiIndicatorsComponent,
    LessonStatusLabelPipe,
    LessonStatusSeverityPipe,
    LessonStatusClassPipe,
    TagModule,
    LessonsDashboardComponent
],
    templateUrl: './lessons-list.component.html',
    styles: [`

        /* Active filter tags */
        .filter-tag {
            display: inline-flex;
            align-items: center;
            background-color: #e9ecef;
            border-radius: 16px;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
        }

        /* Calendar Styles */
        .weekly-calendar .today-card {
            border: 2px solid var(--primary-color);
            background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.05), rgba(var(--primary-color-rgb), 0.1));
        }

        .day-header {
            margin-bottom: 0.5rem;
        }

        .today-date {
            color: var(--primary-color);
            background: rgba(var(--primary-color-rgb), 0.1);
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .today-label {
            margin-top: 0.25rem;
        }

        .class-card {
            background: white;
            border: 1px solid #e0e4e7;
            transition: all 0.2s ease;
        }

        .class-card:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .class-title {
            color: #374151;
        }

        .class-details {
            line-height: 1.3;
        }

        .border-success {
            border-left-color: #10b981 !important;
        }

        .border-warning {
            border-left-color: #f59e0b !important;
        }

        .border-danger {
            border-left-color: #ef4444 !important;
        }

        .p-badge-success {
            background-color: #10b981;
        }

        .p-badge-warning {
            background-color: #f59e0b;
        }

        .p-badge-danger {
            background-color: #ef4444;
        }

        /* Monthly Calendar Styles */
        .monthly-calendar .calendar-header {
            padding: 1rem 0;
            background: #f8fafc;
        }

        .calendar-day {
            min-height: 8rem;
            padding: 0.5rem;
            border-right: 1px solid #e5e7eb;
            cursor: pointer;
            transition: background-color 0.2s ease;
            position: relative;
        }

        .calendar-day:hover {
            background-color: #f3f4f6;
        }

        .calendar-day:last-child {
            border-right: none;
        }

        .calendar-week:last-child .calendar-day {
            border-bottom: none;
        }

        .calendar-day.current-month {
            background-color: #ffffff;
        }

        .calendar-day.today-day {
            background-color: rgba(var(--primary-color-rgb), 0.05);
        }

        .day-number {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .today-number {
            color: var(--primary-color);
            background: rgba(var(--primary-color-rgb), 0.1);
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.5rem auto;
        }

        .today-indicator {
            position: absolute;
            top: 0.25rem;
            right: 0.25rem;
            width: 0.5rem;
            height: 0.5rem;
            background-color: var(--primary-color);
            border-radius: 50%;
        }

        .monthly-lessons {
            margin-top: 0.25rem;
        }

        .monthly-lesson-card {
            background: white;
            border: 1px solid #e0e4e7;
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
            margin-bottom: 0.25rem;
            transition: all 0.2s ease;
            font-size: 0.75rem;
        }

        .monthly-lesson-card:hover {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .lesson-time {
            color: #6b7280;
            margin-bottom: 0.125rem;
        }

        .lesson-title {
            color: #374151;
            font-weight: 500;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .more-lessons {
            text-align: center;
            padding: 0.125rem;
            font-style: italic;
        }

        .border-left-2 {
            border-left-width: 2px;
        }

        /* Lesson Details Dialog Styles */
        ::ng-deep .lesson-details-dialog {
            z-index: 9999;
        }

        ::ng-deep .lesson-details-dialog .p-dialog {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            overflow: hidden;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        ::ng-deep .lesson-details-dialog .p-dialog-content {
            padding: 1.25rem;
            max-height: 70vh;
            overflow-y: auto;
        }

        ::ng-deep .lesson-details-dialog .p-dialog-header {
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.25rem;
            border-bottom: none;
        }

        ::ng-deep .lesson-details-dialog .p-dialog-header .p-dialog-title {
            color: white;
            font-weight: 600;
            font-size: 1rem;
        }

        ::ng-deep .lesson-details-dialog .p-dialog-header .p-dialog-header-icon {
            color: white;
            opacity: 0.9;
        }

        ::ng-deep .lesson-details-dialog .p-dialog-header .p-dialog-header-icon:hover {
            opacity: 1;
        }

        /* Smooth hover transitions for lesson cards */
        .class-card {
            transition: all 0.2s ease, transform 0.2s ease;
        }

        .class-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .lesson-details-content h6 {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }

        .lesson-details-content .text-600 {
            color: var(--text-color-secondary);
        }
    `]
})
export class LessonsListComponent implements OnInit, OnDestroy, AfterViewInit {
    private lessonService = inject(LessonService);
    private employeeService = inject(EmployeeService);
    private centerService = inject(CenterService);
    private levelService = inject(LevelService);
    private unitService = inject(UnitService);
    private router = inject(Router);

    lesson: Lesson = {} as Lesson;

    lessons$: Observable<Lesson[]>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    totalElements$: Observable<number>;

    private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);
    private totalElementsSubject = new BehaviorSubject<number>(0);

    classes: Lesson[] = [];

    readonly DEFAULT_PAGE_SIZE = 10;
    readonly DEFAULT_SORT = 'startDatetime,desc';

    private currentSort = this.DEFAULT_SORT;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online'];

    levels = LEVELS;

    columns: any[] = LESSON_COLUMNS;

    globalFilterFields: string[] = LESSONS_GLOBAL_FILTER_FIELDS;

    // ── KPIs ─────────────────────────────────────────────────────────────────
    kpis: Kpi[] = [];

    private buildKpis(lessons: Lesson[], total: number): void {
        const available  = lessons.filter(l => l.status === 'AVAILABLE').length;
        const booked     = lessons.filter(l => l.status === 'BOOKED' || l.status === 'SCHEDULED').length;
        const completed  = lessons.filter(l => l.status === 'COMPLETED').length;
        const cancelled  = lessons.filter(l => l.status === 'CANCELLED').length;
        const online     = lessons.filter(l => l.online).length;

        this.kpis = [
            {label: 'Total de Aulas',  value: total,     icon: {label: 'calendar',        color: 'text-blue-500'}},
            {label: 'Disponíveis',     value: available, icon: {label: 'user-check',       color: 'text-green-500'}},
            {label: 'Concluídas',      value: completed, icon: {label: 'graduation-cap',   color: 'text-purple-500'}},
            {label: 'Canceladas',      value: cancelled, icon: {label: 'user-cancel',      color: 'text-red-500'}},
            {label: 'Online',          value: online,    icon: {label: 'exclamation-circle',color: 'text-cyan-500'}},
        ];
    }

    // ── Filters ───────────────────────────────────────────────────────────────
    searchTerm: string = '';
    showFilterDialog: boolean = false;

    filterTeacherId: string | null = null;
    filterUnitId: string | null = null;
    filterCenterId: string | null = null;
    filterLevelId: string | null = null;
    filterStatus: string | null = null;
    filterOnline: boolean | null = null;
    filterHasBookings: boolean = false;
    filterWithoutBookings: boolean = false;
    filterStartDate: Date | null = null;
    filterEndDate: Date | null = null;
    filterSortField: string | null = null;
    filterSortDirection: 'asc' | 'desc' = 'asc';

    // Dropdown options loaded from API
    teacherOptions: { label: string; value: string }[] = [];
    centerOptions: { label: string; value: string }[] = [];
    unitOptions: { label: string; value: string }[] = [];
    levelOptions: { label: string; value: string }[] = [];

    readonly statusOptions = [
        {label: 'Disponível', value: 'AVAILABLE'},
        {label: 'Lecionada', value: 'COMPLETED'},
        {label: 'Cancelada', value: 'CANCELLED'},
        {label: 'Sem agendamento', value: 'OVERDUE'},
    ];

    readonly onlineOptions = [
        {label: 'Online', value: true},
        {label: 'Presencial', value: false},
    ];

    readonly sortFieldOptions = [
        {label: 'Título', value: 'title'},
        {label: 'Status', value: 'status'},
        {label: 'Data de início', value: 'startDatetime'},
        {label: 'Data de fim', value: 'endDatetime'},
    ];

    readonly sortDirectionOptions = [
        {label: 'Crescente', value: 'asc'},
        {label: 'Decrescente', value: 'desc'},
    ];

    private searchSubject = new Subject<void>();

    get hasActiveFilters(): boolean {
        return !!(this.filterTeacherId || this.filterUnitId || this.filterCenterId ||
            this.filterLevelId || this.filterStatus || this.filterOnline !== null ||
            this.filterHasBookings || this.filterWithoutBookings ||
            this.filterStartDate || this.filterEndDate || this.filterSortField);
    }

    getTeacherLabel(id: string): string {
        return this.teacherOptions.find(o => o.value === id)?.label ?? id;
    }

    getCenterLabel(id: string): string {
        return this.centerOptions.find(o => o.value === id)?.label ?? id;
    }

    getUnitLabel(id: string): string {
        return this.unitOptions.find(o => o.value === id)?.label ?? id;
    }

    getLevelLabel(id: string): string {
        return this.levelOptions.find(o => o.value === id)?.label ?? id;
    }

    onHasBookingsChange(): void {
        if (this.filterHasBookings) this.filterWithoutBookings = false;
    }

    onWithoutBookingsChange(): void {
        if (this.filterWithoutBookings) this.filterHasBookings = false;
    }

    onSearchInput(): void {
        this.searchSubject.next();
    }

    applyFilters(): void {
        this.loadLessons(0, this.DEFAULT_PAGE_SIZE, this.currentSort);
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.filterTeacherId = null;
        this.filterUnitId = null;
        this.filterCenterId = null;
        this.filterLevelId = null;
        this.filterStatus = null;
        this.filterOnline = null;
        this.filterHasBookings = false;
        this.filterWithoutBookings = false;
        this.filterStartDate = null;
        this.filterEndDate = null;
        this.filterSortField = null;
        this.filterSortDirection = 'asc';
        this.loadLessons(0, this.DEFAULT_PAGE_SIZE, this.currentSort);
    }

    private loadFilterOptions(): void {
        this.employeeService.getTeachers().pipe(takeUntil(this.destroy$)).subscribe(teachers => {
            this.teacherOptions = teachers.map(t => ({
                label: `${t.personalInfo.firstName} ${t.personalInfo.lastName}`.trim(),
                value: t.id
            }));
        });
        this.centerService.getAllCenters().pipe(takeUntil(this.destroy$)).subscribe(centers => {
            this.centerOptions = centers.map(c => ({label: c.name, value: c.id}));
        });
        this.unitService.loadUnits().pipe(takeUntil(this.destroy$)).subscribe(units => {
            this.unitOptions = units.map(u => ({label: u.name, value: u.id}));
        });
        this.levelService.getLevels().pipe(takeUntil(this.destroy$)).subscribe(levels => {
            this.levelOptions = levels.map(l => ({label: l.name, value: l.id}));
        });
    }

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        {label: 'Lista de Aulas', value: 'list'},
        {label: 'Relatórios', value: 'relatorios'},
    ];

    // References to sticky header elements
    @ViewChild('mainHeader', {static: false})
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', {static: false})
    viewSelector!: ElementRef;

    @ViewChild('teacherTemplate', {static: true})
    teacherTemplate!: TemplateRef<any>;

    @ViewChild('centerTemplate', {static: true})
    centerTemplate!: TemplateRef<any>;

    @ViewChild('unitTemplate', {static: true})
    unitTemplate!: TemplateRef<any>;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Calendar view state
    calendarView: 'week' | 'month' = 'week';
    currentDate: Date = new Date();
    currentWeekStart: Date = new Date();
    currentWeekEnd: Date = new Date();

    // Sample lesson data for calendar
    weeklyLessons: WeeklyLessonDay[] = [];
    monthlyCalendarDays: any[] = [];
    readonly maxVisibleLessonsPerDay = 5;
    private expandedDayLessons = new Set<string>();

    // Dialog state
    lessonDialogVisible = signal(false);
    selectedLesson: Lesson | null = null;
    private hoverTimeout: any = null;
    private dialogHoverTimeout: any = null;
    private isDialogHovered: boolean = false;

    @ViewChild("startDatetime", {static: true})
    startDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("actionsTemplate", {static: true})
    actionsTemplate?: TemplateRef<any>;


    @ViewChild("statusTemplate", {static: true})
    statusTemplate?: TemplateRef<any>;

    @ViewChild("onlineTemplate", {static: true})
    onlineTemplate?: TemplateRef<any>;

    columnTemplates: Record<string, TemplateRef<any>> = {}

    private destroy$ = new Subject<void>();

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
        if (this.currentView === 'calendario') {
            this.initializeCalendarData();
            // Load calendar data with current lessons
            if (this.classes?.length > 0) {
                if (this.calendarView === 'week') {
                    this.loadWeeklyLessonsFromData(this.classes);
                } else {
                    this.loadMonthlyLessonsFromData(this.classes);
                }
            }
        }
    }

    // Calendar methods
    initializeCalendarData() {
        this.setCurrentWeek();
        this.loadMonthlyLessons();
    }

    setCurrentWeek(referenceDate: Date = this.currentDate) {
        const baseDate = new Date(referenceDate);
        const currentDay = baseDate.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days

        this.currentWeekStart = new Date(baseDate);
        this.currentWeekStart.setDate(baseDate.getDate() + mondayOffset);
        this.currentWeekStart = this.getStartOfDay(this.currentWeekStart);

        this.currentWeekEnd = new Date(this.currentWeekStart);
        this.currentWeekEnd.setDate(this.currentWeekStart.getDate() + 6);
        this.currentWeekEnd = this.getEndOfDay(this.currentWeekEnd);
    }

    loadMonthlyLessons() {
        // Generate monthly calendar grid
        this.generateMonthlyCalendar();

        // Load lessons for the current month
        if (this.classes?.length > 0) {
            this.loadMonthlyLessonsFromData(this.classes);
        }
    }

    /**
     * Generate monthly calendar grid
     */
    generateMonthlyCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first day of month and last day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDay.getDay();

        // Get the day of week for last day
        const lastDayOfWeek = lastDay.getDay();

        // Calculate how many days from previous month to show
        const daysFromPrevMonth = firstDayOfWeek;

        // Calculate how many days from next month to show
        const daysFromNextMonth = 6 - lastDayOfWeek;

        this.monthlyCalendarDays = [];

        // Add days from previous month
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const day = new Date(year, month - 1, prevMonth.getDate() - i);
            this.monthlyCalendarDays.push({
                date: day,
                dayNumber: day.getDate(),
                isCurrentMonth: false,
                isToday: day.toDateString() === new Date().toDateString(),
                lessons: []
            });
        }

        // Add days from current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            this.monthlyCalendarDays.push({
                date: date,
                dayNumber: day,
                isCurrentMonth: true,
                isToday: date.toDateString() === new Date().toDateString(),
                lessons: []
            });
        }

        // Add days from next month
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const date = new Date(year, month + 1, day);
            this.monthlyCalendarDays.push({
                date: date,
                dayNumber: day,
                isCurrentMonth: false,
                isToday: date.toDateString() === new Date().toDateString(),
                lessons: []
            });
        }
    }

    /**
     * Load monthly lessons from real data
     */
    loadMonthlyLessonsFromData(lessons: Lesson[]) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first and last day of the month with full-day boundaries.
        const firstDay = this.getStartOfDay(new Date(year, month, 1));
        const lastDay = this.getEndOfDay(new Date(year, month + 1, 0));

        // Filter lessons for current month
        const monthLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.startDatetime);
            return lessonDate >= firstDay && lessonDate <= lastDay;
        });

        // Assign lessons to calendar days
        this.monthlyCalendarDays.forEach(day => {
            day.lessons = monthLessons.filter(lesson => {
                const lessonDate = new Date(lesson.startDatetime);
                return lessonDate.toDateString() === day.date.toDateString();
            }).sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime())
                .map(lesson => ({
                    time: new Date(lesson.startDatetime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    title: lesson.title,
                    teacher: lesson.teacher.name,
                    group: lesson.level || 'N/A',
                    status: this.getStatusLabel(lesson.status),
                    statusClass: this.getStatusClass(lesson.status),
                    lesson: lesson
                }));
        });
    }

    /**
     * Get monthly calendar organized in weeks
     */
    getMonthlyCalendarWeeks(): any[][] {
        const weeks: any[][] = [];
        let currentWeek: any[] = [];

        this.monthlyCalendarDays.forEach((day, index) => {
            currentWeek.push(day);

            // If we have 7 days or it's the last day, create a new week
            if (currentWeek.length === 7 || index === this.monthlyCalendarDays.length - 1) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });

        return weeks;
    }

    switchCalendarView(view: 'week' | 'month') {
        this.calendarView = view;

        if (view === 'month') {
            this.generateMonthlyCalendar();
        }

        // Load appropriate data for the selected view
        if (this.classes?.length > 0) {
            if (view === 'week') {
                this.loadWeeklyLessonsFromData(this.classes);
            } else {
                this.loadMonthlyLessonsFromData(this.classes);
            }
        }
    }

    navigatePrevious() {
        if (this.calendarView === 'week') {
            this.currentWeekStart = new Date(this.currentWeekStart);
            this.currentWeekEnd = new Date(this.currentWeekEnd);
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
            this.currentWeekStart = this.getStartOfDay(this.currentWeekStart);
            this.currentWeekEnd = this.getEndOfDay(this.currentWeekEnd);

            if (this.classes?.length > 0) {
                this.loadWeeklyLessonsFromData(this.classes);
            }
        } else {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            this.currentDate = newDate;

            this.generateMonthlyCalendar();
            if (this.classes?.length > 0) {
                this.loadMonthlyLessonsFromData(this.classes);
            }
        }
    }

    navigateNext() {
        if (this.calendarView === 'week') {
            this.currentWeekStart = new Date(this.currentWeekStart);
            this.currentWeekEnd = new Date(this.currentWeekEnd);
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
            this.currentWeekStart = this.getStartOfDay(this.currentWeekStart);
            this.currentWeekEnd = this.getEndOfDay(this.currentWeekEnd);

            if (this.classes?.length > 0) {
                this.loadWeeklyLessonsFromData(this.classes);
            }
        } else {
            const newDate = new Date(this.currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            this.currentDate = newDate;

            this.generateMonthlyCalendar();
            if (this.classes?.length > 0) {
                this.loadMonthlyLessonsFromData(this.classes);
            }
        }
    }

    navigateToday() {
        this.currentDate = new Date();
        this.setCurrentWeek(this.currentDate);

        if (this.calendarView === 'month') {
            this.generateMonthlyCalendar();
        }

        // Load real data for today
        if (this.classes?.length > 0) {
            if (this.calendarView === 'week') {
                this.loadWeeklyLessonsFromData(this.classes);
            } else {
                this.loadMonthlyLessonsFromData(this.classes);
            }
        }
    }

    getFormattedWeekRange(): string {
        const start = this.currentWeekStart.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
        const end = this.currentWeekEnd.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
        return `Semana de ${start} a ${end}`;
    }

    getFormattedMonth(): string {
        return this.currentDate.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'});
    }

    private getDayKey(day: { date?: Date | string; dayKey?: string }): string {
        if (day.dayKey) {
            return day.dayKey;
        }
        return day.date ? new Date(day.date).toDateString() : '';
    }

    isDayExpanded(day: { date?: Date | string; dayKey?: string }): boolean {
        const key = this.getDayKey(day);
        return !!key && this.expandedDayLessons.has(key);
    }

    toggleDayLessons(day: { date?: Date | string; dayKey?: string }): void {
        const key = this.getDayKey(day);
        if (!key) return;
        if (this.expandedDayLessons.has(key)) {
            this.expandedDayLessons.delete(key);
        } else {
            this.expandedDayLessons.add(key);
        }
    }

    getVisibleWeeklyClasses(dayData: { classes: any[]; dayKey?: string }): any[] {
        if (!Array.isArray(dayData.classes)) return [];
        if (dayData.classes.length <= this.maxVisibleLessonsPerDay || this.isDayExpanded(dayData)) {
            return dayData.classes;
        }
        return dayData.classes.slice(0, this.maxVisibleLessonsPerDay);
    }

    getVisibleMonthlyLessons(day: { lessons: any[]; date?: Date | string; dayKey?: string }): any[] {
        if (!Array.isArray(day.lessons)) return [];
        if (day.lessons.length <= this.maxVisibleLessonsPerDay || this.isDayExpanded(day)) {
            return day.lessons;
        }
        return day.lessons.slice(0, this.maxVisibleLessonsPerDay);
    }

    // Listen for scroll events
    @HostListener('window:scroll')
    onWindowScroll() {
        this.checkStickyState();
    }

    // Check if headers are in sticky state
    checkStickyState() {
        if (this.mainHeader && this.mainHeader.nativeElement) {
            const mainHeaderRect = this.mainHeader.nativeElement.getBoundingClientRect();
            // Header is sticky when its top position is 0
            this.isMainHeaderSticky = mainHeaderRect.top <= 0;
        }

        if (this.viewSelector && this.viewSelector.nativeElement) {
            const viewSelectorRect = this.viewSelector.nativeElement.getBoundingClientRect();
            // View selector is sticky when its top position is at its sticky position (80px)
            this.isViewSelectorSticky = viewSelectorRect.top <= 80;
        }
    }

    constructor() {
        this.lessons$ = this.lessonsSubject.asObservable();
        this.loading$ = this.loadingSubject.asObservable();
        this.error$ = this.errorSubject.asObservable();
        this.totalElements$ = this.totalElementsSubject.asObservable();
    }

    ngOnInit(): void {
        this.initializeCalendarData();

        // Wire search debounce
        this.searchSubject.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => {
            this.loadLessons(0, this.DEFAULT_PAGE_SIZE, this.currentSort);
        });

        // Subscribe to lessons for calendar view
        this.lessons$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(lessons => {
            this.classes = lessons;
            if (this.currentView === 'calendario') {
                if (this.calendarView === 'week') {
                    this.loadWeeklyLessonsFromData(lessons);
                } else {
                    this.loadMonthlyLessonsFromData(lessons);
                }
            }
        });

        this.loadFilterOptions();
        this.loadLessons(0, this.DEFAULT_PAGE_SIZE, this.DEFAULT_SORT);
    }

    ngAfterViewInit() {
        this.columnTemplates = {
            startDatetime: this.startDatetimeTemplate!,
            teacher: this.teacherTemplate!,
            center: this.centerTemplate!,
            unit: this.unitTemplate!,
            status: this.statusTemplate!,
            actions: this.actionsTemplate!,
            online: this.onlineTemplate!,
        }

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        // Clean up hover timeouts
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }
        if (this.dialogHoverTimeout) {
            clearTimeout(this.dialogHoverTimeout);
            this.dialogHoverTimeout = null;
        }
    }

    navigateToCreateLesson() {
        this.router.navigate(['/schoolar/lessons/create']).then();
    }

    private loadLessons(page: number, size: number, sort?: string): void {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        const resolvedSort = this.filterSortField
            ? `${this.filterSortField},${this.filterSortDirection}`
            : sort;

        this.lessonService.searchLessons({
            page,
            size,
            sort: resolvedSort,
            titleContains: this.searchTerm || undefined,
            teacherId: this.filterTeacherId ?? undefined,
            unitId: this.filterUnitId ?? undefined,
            centerId: this.filterCenterId ?? undefined,
            levelId: this.filterLevelId ?? undefined,
            status: this.filterStatus ?? undefined,
            online: this.filterOnline !== null ? this.filterOnline : undefined,
            hasBookings: this.filterHasBookings || undefined,
            withoutBookings: this.filterWithoutBookings || undefined,
            startDate: this.filterStartDate ? this.filterStartDate.toISOString() : undefined,
            endDate: this.filterEndDate ? this.filterEndDate.toISOString() : undefined,
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    const lessons = response.content ?? [];
                    const total   = response.totalElements ?? 0;
                    this.lessonsSubject.next(lessons);
                    this.totalElementsSubject.next(total);
                    this.buildKpis(lessons, total);
                    this.loadingSubject.next(false);
                },
                error: (err) => {
                    this.errorSubject.next(err?.message ?? 'Erro ao carregar aulas');
                    this.loadingSubject.next(false);
                }
            });
    }

    onPageChange(event: { page: number; rows: number; sort?: string }): void {
        if (event.sort) {
            this.currentSort = event.sort;
        }
        this.loadLessons(event.page, event.rows, this.currentSort);
    }

    retryLoadLessons(): void {
        this.loadLessons(0, this.DEFAULT_PAGE_SIZE, this.currentSort);
    }

    /**
     * Show lesson details dialog with hover delay
     */
    showLessonDetails(lesson: Lesson) {
        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Show dialog after a short delay
        this.hoverTimeout = setTimeout(() => {
            this.selectedLesson = lesson;
            this.lessonDialogVisible.set(true);
        }, 300); // 300ms delay
    }

    /**
     * Hide lesson details dialog
     */
    hideLessonDetails() {
        // Clear timeout to prevent showing
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Add a small delay to allow mouse to move to dialog
        setTimeout(() => {
            // Only hide if dialog is not being hovered
            if (!this.isDialogHovered) {
                this.lessonDialogVisible.set(false);
                this.selectedLesson = null;
            }
        }, 100); // 100ms delay to allow mouse movement to dialog
    }

    /**
     * Keep dialog open when hovering over it
     */
    keepDialogOpen() {
        // Clear any hide timeout to keep dialog open
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Mark dialog as being hovered
        this.isDialogHovered = true;

        // Clear any dialog hide timeout
        if (this.dialogHoverTimeout) {
            clearTimeout(this.dialogHoverTimeout);
            this.dialogHoverTimeout = null;
        }
    }

    /**
     * Handle dialog mouse leave
     */
    onDialogMouseLeave() {
        this.isDialogHovered = false;

        // Add a small delay before hiding to allow for mouse movement back to lesson card
        this.dialogHoverTimeout = setTimeout(() => {
            if (!this.isDialogHovered) {
                this.lessonDialogVisible.set(false);
                this.selectedLesson = null;
            }
        }, 150); // 150ms delay
    }

    /**
     * Get students list as comma-separated string
     */
    getStudentsString(lesson: Lesson): string {
        if (lesson.students && lesson.students.length > 0) {
            return lesson.students.map(student => student.name || student.toString()).join(', ');
        }
        return 'Nenhum aluno inscrito';
    }

    /**
     * Get materials list as comma-separated string
     */
    getMaterialsString(lesson: Lesson): string {
        if (lesson.materials && lesson.materials.length > 0) {
            return lesson.materials.map(material => material.title || material.toString()).join(', ');
        }
        return 'Nenhum material';
    }

    /**
     * View lesson details
     */
    viewLesson(lessonId: string) {
        this.router.navigate(['/schoolar/lessons', lessonId]).then();
    }

    /**
     * Edit lesson
     */
    editLesson(lessonId: string) {
        // Navigate to edit page or open edit dialog
        this.router.navigate(['/schoolar/lessons', lessonId, 'edit']).then();
    }

    /**
     * Navigate to schedule page with the lesson pre-selected
     */
    scheduleLesson(lessonId: string) {
        this.router.navigate(['/schoolar/lessons/schedule'], {queryParams: {lessonId}}).then();
    }

    /**
     * Duplicate lesson by opening create form prefilled.
     */
    duplicateLesson(lessonId: string) {
        this.router.navigate(['/schoolar/lessons/create'], {
            queryParams: {duplicateFrom: lessonId}
        }).then();
    }

    /**
     * Open online lesson link
     */
    openOnlineLink(link: string) {
        window.open(link, '_blank');
    }

    /**
     * Get display label for lesson status
     */
    getStatusLabel(status: string | LessonStatus): string {
        if (typeof status === 'string') {
            switch (status.toUpperCase()) {
                case 'AVAILABLE':
                    return 'Disponível';
                case 'BOOKED':
                    return 'Agendada';
                case 'COMPLETED':
                    return 'Concluída';
                case 'CANCELLED':
                    return 'Cancelada';
                case 'SCHEDULED':
                    return 'Agendada';
                case 'POSTPONED':
                    return 'Adiada';
                case 'OVERDUE':
                    return 'Lecionada';
                default:
                    return status;
            }
        }
        // Handle enum values
        switch (status) {
            case LessonStatus.AVAILABLE:
                return 'Disponível';
            case LessonStatus.BOOKED:
                return 'Agendada';
            case LessonStatus.COMPLETED:
                return 'Concluída';
            case LessonStatus.CANCELLED:
                return 'Cancelada';
            case LessonStatus.SCHEDULED:
                return 'Agendada';
            case LessonStatus.POSTPONED:
                return 'Adiada';
            case LessonStatus.OVERDUE:
                return 'Lecionada';
            default:
                return 'Desconhecido';
        }
    }

    /**
     * Load weekly lessons from real data
     */
    loadWeeklyLessonsFromData(lessons: Lesson[]) {
        const weekStart = this.getStartOfDay(new Date(this.currentWeekStart));
        const weekEnd = this.getEndOfDay(new Date(this.currentWeekEnd));

        // Filter lessons for current week
        const weekLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.startDatetime);
            return lessonDate >= weekStart && lessonDate <= weekEnd;
        });

        // Create week structure
        this.weeklyLessons = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);

            const dayLessons = weekLessons.filter(lesson => {
                const lessonDate = new Date(lesson.startDatetime);
                return lessonDate.toDateString() === currentDay.toDateString();
            }).sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());

            const isToday = currentDay.toDateString() === new Date().toDateString();

            const classes: WeeklyLessonCard[] = dayLessons.map(lesson => ({
                time: new Date(lesson.startDatetime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
                title: lesson.title,
                teacher: lesson.teacher.name,
                group: lesson.level || 'N/A',
                status: this.getStatusLabel(lesson.status),
                statusClass: this.getStatusClass(lesson.status),
                lesson: lesson // Include the full lesson object for the dialog
            }));

            this.weeklyLessons.push({
                day: currentDay.toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit', month: '2-digit'}),
                date: currentDay.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
                dayKey: currentDay.toDateString(),
                isToday,
                classes
            });
        }
    }

    /**
     * Get CSS class for status
     */
    private getStatusClass(status: string | LessonStatus): string {
        if (typeof status === 'string') {
            switch (status.toUpperCase()) {
                case 'AVAILABLE':
                case 'COMPLETED':
                    return 'success';
                case 'BOOKED':
                case 'SCHEDULED':
                    return 'warning';
                case 'CANCELLED':
                case 'OVERDUE':
                    return 'info';
                case 'POSTPONED':
                    return 'info';
                default:
                    return 'secondary';
            }
        }
        // Handle enum values
        switch (status) {
            case LessonStatus.AVAILABLE:
            case LessonStatus.COMPLETED:
                return 'success';
            case LessonStatus.BOOKED:
            case LessonStatus.SCHEDULED:
                return 'warning';
            case LessonStatus.CANCELLED:
            case LessonStatus.OVERDUE:
                return 'info';
            case LessonStatus.POSTPONED:
                return 'info';
            default:
                return 'secondary';
        }
    }

    private getStartOfDay(date: Date): Date {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    }

    private getEndOfDay(date: Date): Date {
        const normalized = new Date(date);
        normalized.setHours(23, 59, 59, 999);
        return normalized;
    }

    getOnlineType(online: boolean): string {
        return online ? 'Online' : 'Presencial';
    }

    getFormattedDateTime(startDatetime: string | Date, endDatetime: string | Date): string {
        const start = new Date(startDatetime);
        const end = new Date(endDatetime);
        return `${start.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })} - ${end.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })} | ${start.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}`;
    }
}
