import { Component, ComponentRef, OnInit, ViewContainerRef, ViewChild, ElementRef, HostListener, AfterViewInit, signal, inject, OnDestroy } from '@angular/core';
import {EventTooltipComponent} from 'src/app/shared/components/event-tooltip/event-tooltip.component';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {LessonEvent} from "../../../../../core/models/academic/lesson-event";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import {Router} from "@angular/router";
import {TabViewModule} from "primeng/tabview";
import {CardModule} from "primeng/card";
import {SelectButtonModule} from "primeng/selectbutton";
import {KpiIndicatorsComponent} from "src/app/shared/kpi-indicator/kpi-indicator.component";
import {CalendarReportsComponent} from "./reports/calendar-reports.component";
import {LessonService} from 'src/app/core/services/lessons/lesson.service';
import {LessonStatus} from 'src/app/core/enums/lesson-status';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {EmployeeService} from 'src/app/core/services/corporate/employee.service';
import {CenterService} from 'src/app/core/services/center.service';
import {LevelService} from 'src/app/core/services/level.service';
import {UnitService} from 'src/app/core/services/unit.service';

@Component({
    selector: "app-lesson-calendar",
    templateUrl: './calendar.app.component.html',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        PaginatorModule,
        DialogModule,
        CalendarModule,
        CommonModule,
        InputTextModule,
        DropdownModule,
        ButtonModule,
        TooltipModule,
        InputSwitchModule,
        MultiSelectModule,
        TabViewModule,
        CardModule,
        SelectButtonModule,
        KpiIndicatorsComponent,
        CalendarReportsComponent
    ],
    styleUrls: ['./calendar.app.component.scss']
})
export class CalendarAppComponent implements OnInit, AfterViewInit, OnDestroy {
    private viewContainerRef = inject(ViewContainerRef);
    private router = inject(Router);
    private lessonService = inject(LessonService);
    private employeeService = inject(EmployeeService);
    private centerService = inject(CenterService);
    private levelService = inject(LevelService);
    private unitService = inject(UnitService);

    @ViewChild('mainHeader', {static: false}) mainHeader!: ElementRef;
    @ViewChild('viewSelector', {static: false}) viewSelector!: ElementRef;

    events: Partial<LessonEvent>[] = [];
    filteredEvents: Partial<LessonEvent>[] = [];

    today: string = '';

    showDialog: boolean = false;
    showFilterDialog: boolean = false;

    clickedEvent: any = null;

    dateClicked: boolean = false;

    edit: boolean = false;

    // Variables for double-click detection
    lastClickedDate: Date | null = null;
    lastClickTime: number = 0;
    doubleClickDelay: number = 300; // milliseconds

    tags: any[] = [];
    selectedTags: any[] = [];

    view: string = '';

    changedEvent: any;

    searchTerm: string = '';

    // Calendar view options
    calendarViewOptions: any[] = [
        {label: 'Mês', value: 'month'},
        {label: 'Semana', value: 'week'}
    ];
    selectedCalendarView: string = 'month';

    // Tab view options (like students list)
    currentView: string = 'calendar'; // Default view is calendar
    viewOptions = [
        {label: 'Calendário', value: 'calendar', permission: 'lessons.calendar'},
        {label: 'Relatórios', value: 'reports', permission: 'lessons.reports'},
        {label: 'Configurações', value: 'settings', permission: 'lessons.settings'}
    ];

    // Sticky header state
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Current month/year display
    currentMonthYear: string = '';

    // API filter state
    filterTeacherId: string | null = null;
    filterUnitId: string | null = null;
    filterCenterId: string | null = null;
    filterLevelId: string | null = null;
    filterStatus: string | null = null;
    filterOnline: boolean | null = null;
    filterHasBookings = false;
    filterWithoutBookings = false;
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
        {label: 'Concluída', value: 'COMPLETED'},
        {label: 'Cancelada', value: 'CANCELLED'},
        {label: 'Atrasada', value: 'OVERDUE'},
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

    // Dark mode toggle
    darkMode: boolean = false;

    // KPI metrics as numbers
    totalLessons: number = 0;
    activeLessons: number = 0;
    canceledLessons: number = 0;
    onlineLessons: number = 0;
    inPersonLessons: number = 0;

    // KPI metrics as Kpi objects for the KpiIndicatorsComponent
    kpis: any[] = [];

    // For math calculations in template
    protected readonly Math = Math;

    private tooltipRef: ComponentRef<EventTooltipComponent> | null = null;
    private destroy$ = new Subject<void>();

    // Custom calendar properties
    currentDate: Date = new Date();
    currentWeekStart: Date = new Date();
    currentWeekEnd: Date = new Date();
    weeklyLessons: any[] = [];
    monthlyCalendarDays: any[] = [];
    classes: Lesson[] = [];
    readonly maxVisibleLessonsPerDay = 5;
    private expandedDayLessons = new Set<string>();

    // Dialog state
    lessonDialogVisible = signal(false);
    selectedLesson: Lesson | null = null;
    private hoverTimeout: any = null;
    private dialogHoverTimeout: any = null;
    private isDialogHovered: boolean = false;

    // Listen for scroll events
    @HostListener('window:scroll')
    onWindowScroll() {
        this.checkStickyState();
    }

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
    }

    ngOnInit(): void {
        const now = new Date();
        this.today = now.toISOString().split('T')[0];

        this.initializeCalendarData();

        this.searchSubject.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => {
            this.loadLessonsFromApi();
        });

        this.loadFilterOptions();
        this.loadLessonsFromApi();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.checkStickyState();
        });
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

    loadLessonsFromApi(): void {
        const {startDate, endDate} = this.getCalendarDateRange();
        const sort = this.filterSortField
            ? `${this.filterSortField},${this.filterSortDirection}`
            : undefined;

        this.lessonService.searchLessons({
            teacherId: this.filterTeacherId ?? undefined,
            unitId: this.filterUnitId ?? undefined,
            centerId: this.filterCenterId ?? undefined,
            levelId: this.filterLevelId ?? undefined,
            startDate,
            endDate,
            status: this.filterStatus ?? undefined,
            online: this.filterOnline ?? undefined,
            titleContains: this.searchTerm || undefined,
            hasBookings: this.filterHasBookings || undefined,
            withoutBookings: this.filterWithoutBookings || undefined,
            page: 0,
            size: 500,
            sort,
        }).pipe(takeUntil(this.destroy$)).subscribe(response => {
            const lessons: Lesson[] = response?.content ?? [];
            this.classes = lessons;
            this.events = lessons.map(lesson => this.mapLessonToEvent(lesson));
            this.filteredEvents = [...this.events];
            this.tags = Array.from(new Set(this.events.map(item => JSON.stringify(item.tag))))
                .map(item => JSON.parse(item));
            this.calculateKpiMetrics();
            this.initializeKpis();
            if (this.selectedCalendarView === 'week') {
                this.loadWeeklyLessonsFromData(lessons);
            } else {
                this.loadMonthlyLessonsFromData(lessons);
            }
        });
    }

    private getCalendarDateRange(): {startDate: string; endDate: string} {
        if (this.selectedCalendarView === 'week') {
            const start = new Date(this.currentWeekStart);
            const end = new Date(this.currentWeekEnd);
            end.setDate(end.getDate() + 1);
            return {startDate: start.toISOString(), endDate: end.toISOString()};
        }
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59);
        return {startDate: start.toISOString(), endDate: end.toISOString()};
    }

    onSearchInput(): void {
        this.searchSubject.next();
    }

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
        if (this.filterHasBookings) {
            this.filterWithoutBookings = false;
        }
    }

    onWithoutBookingsChange(): void {
        if (this.filterWithoutBookings) {
            this.filterHasBookings = false;
        }
    }

    /**
     * Initialize KPI objects for the KpiIndicatorsComponent
     */
    initializeKpis(): void {
        this.kpis = [
            {
                label: 'Total de aulas',
                value: this.totalLessons,
                icon: {label: 'calendar', color: 'text-blue-500'}
            },
            {
                label: 'Activas',
                value: this.activeLessons,
                icon: {label: 'user-check', color: 'text-green-500'}
            },
            {
                label: 'Canceladas',
                value: this.canceledLessons,
                icon: {label: 'user-cancel', color: 'text-red-500'}
            },
            {
                label: 'Online',
                value: this.onlineLessons,
                icon: {label: 'exclamation-circle', color: 'text-cyan-500'}
            },
            {
                label: 'Presencial',
                value: this.inPersonLessons,
                icon: {label: 'graduation-cap', color: 'text-purple-500'}
            }
        ];
    }

    /**
     * Check if headers are in sticky state
     */
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

    /**
     * Calculate KPI metrics based on filtered events
     */
    calculateKpiMetrics(): void {
        // Total lessons
        this.totalLessons = this.filteredEvents.length;

        // Active lessons
        this.activeLessons = this.filteredEvents.filter(event =>
            event.extendedProps?.status === 'active' ||
            !event.extendedProps?.status
        ).length;

        // Canceled lessons
        this.canceledLessons = this.filteredEvents.filter(event =>
            event.extendedProps?.status === 'canceled'
        ).length;

        // Online lessons
        this.onlineLessons = this.filteredEvents.filter(event =>
            event.extendedProps?.isOnline === true
        ).length;

        // In-person lessons
        this.inPersonLessons = this.filteredEvents.filter(event =>
            event.extendedProps?.isOnline === false
        ).length;

        // Update KPI objects if they've been initialized
        if (this.kpis.length > 0) {
            this.updateKpis();
        }
    }

    /**
     * Update KPI objects with current metric values
     */
    updateKpis(): void {
        // Find and update each KPI by label
        const kpiMap: { [key: string]: number } = {
            'Total de aulas': this.totalLessons,
            'Activas': this.activeLessons,
            'Canceladas': this.canceledLessons,
            'Online': this.onlineLessons,
            'Presencial': this.inPersonLessons
        };

        this.kpis.forEach(kpi => {
            if (kpiMap[kpi.label] !== undefined) {
                kpi.value = kpiMap[kpi.label];
            }
        });
    }

    /**
     * Handle event drop (drag and drop)
     */
    handleEventDrop(info: any): void {
        // Update the event dates
        const eventId = info.event.id;
        this.events = this.events.map(event => {
            if (event.id?.toString() === eventId) {
                return {
                    ...event,
                    start: info.event.start,
                    end: info.event.end || info.event.start
                };
            }
            return event;
        });

        this.applyFilters(); // This will also call calculateKpiMetrics
    }

    /**
     * Handle event resize
     */
    handleEventResize(info: any): void {
        // Update the event dates
        const eventId = info.event.id;
        this.events = this.events.map(event => {
            if (event.id?.toString() === eventId) {
                return {
                    ...event,
                    start: info.event.start,
                    end: info.event.end
                };
            }
            return event;
        });

        this.applyFilters(); // This will also call calculateKpiMetrics
    }

    handleEventMouseEnter(mouseEnterInfo: any) {
        const {title, extendedProps} = mouseEnterInfo.event;
        const position = {
            x: mouseEnterInfo.jsEvent.pageX + 10,
            y: mouseEnterInfo.jsEvent.pageY + 10,
        };

        // Create the tooltip dynamically
        this.tooltipRef = this.viewContainerRef.createComponent(
            EventTooltipComponent
        );
        this.tooltipRef.instance.title = title;
        this.tooltipRef.instance.data = extendedProps;
        this.tooltipRef.instance.description =
            extendedProps.description || 'Sem descrição';
        this.tooltipRef.instance.position = position;
    }

    handleEventMouseLeave() {
        // Destroy the tooltip on mouse leave
        if (this.tooltipRef) {
            this.tooltipRef.destroy();
            this.tooltipRef = null;
        }
    }

    /**
     * Custom event rendering for better visual appearance
     */
    onEventRender(args: any) {
        const {title, extendedProps} = args.event;
        const isOnline = extendedProps.isOnline ? 'Online' : 'Presencial';
        const statusClass = extendedProps.status ? `status-${extendedProps.status.toLowerCase()}` : '';

        return {
            html: `
              <div class="event-container ${statusClass}">
                <div class="event-time">${extendedProps.time || args.timeText}</div>
                <div class="event-title">${title}</div>
                <div class="event-details">
                  <span class="event-location"><i class="pi pi-map-marker"></i> ${extendedProps.center || 'N/A'} (${isOnline})</span>
                  <span class="event-teacher"><i class="pi pi-user"></i> ${extendedProps.teacher || 'N/A'}</span>
                  ${extendedProps.classEntity ? `<span class="event-class"><i class="pi pi-users"></i> ${extendedProps.classEntity}</span>` : ''}
                </div>
              </div>
            `,
        };
    }

    applyFilters(): void {
        this.loadLessonsFromApi();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedTags = [];
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
        this.loadLessonsFromApi();
    }

    /**
     * Create a new event
     */
    createNewEvent(): void {
        // Redirect to lessons create page
        this.router.navigate(['/schoolar/lessons/create']);
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode(): void {
        this.darkMode = !this.darkMode;

        // Apply dark mode class to body
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    /**
     * Update current month and year display
     */
    updateCurrentMonthYear(dateInfo: any): void {
        const date = dateInfo.view.currentStart;
        const options = {month: 'long', year: 'numeric'} as const;
        this.currentMonthYear = date.toLocaleDateString('pt-BR', options as any);
    }

    onEventClick(e: any) {
        this.clickedEvent = e.event;
        let plainEvent = e.event.toPlainObject({
            collapseExtendedProps: true,
            collapseColor: true,
        });

        // Get the event ID
        const eventId = e.event.id;

        // Redirect to lesson student page
        if (eventId) {
            this.router.navigate(['/schoolar/lessons', eventId]);
            return;
        }

        // If no ID is available, show the event details in the dialog
        this.view = 'display';
        this.showDialog = true;

        this.changedEvent = {...plainEvent, ...this.clickedEvent};
        this.changedEvent.start = this.clickedEvent.start;
        this.changedEvent.end = this.clickedEvent.end
            ? this.clickedEvent.end
            : this.clickedEvent.start;
    }

    /**
     * Handle date click event with double-click detection
     */
    onDateClick(e: any) {
        const currentTime = new Date().getTime();
        const clickedDate = e.date;

        // Check if this is a double-click (same date clicked within the delay period)
        if (
            this.lastClickedDate &&
            this.isSameDate(this.lastClickedDate, clickedDate) &&
            (currentTime - this.lastClickTime) < this.doubleClickDelay
        ) {
            // Double-click detected, navigate to create lesson
            this.onDateDoubleClick(clickedDate);
        }

        // Update last click info for next time
        this.lastClickedDate = clickedDate;
        this.lastClickTime = currentTime;
    }

    /**
     * Check if two dates are the same day
     */
    private isSameDate(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    /**
     * Handle double-click on a date
     */
    onDateDoubleClick(date: Date) {
        // Format date for URL parameters
        const startDate = date.toISOString();

        // Create end date (1 hour after start)
        const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString();

        // Extract time from the date
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;

        // Redirect to lessons create page with date and time parameters
        this.router.navigate(['/schoolar/lessons/create'], {
            queryParams: {
                startDate: startDate,
                endDate: endDate,
                time: time
            }
        });
    }

    /**
     * Legacy method for backward compatibility
     */
    onDateSelect(e: any) {
        // This method is kept for backward compatibility
        // The actual functionality is now in onDateDoubleClick
        const date = e.start instanceof Date ? e.start : new Date(e.start);
        this.onDateDoubleClick(date);
    }

    handleSave() {
        if (!this.validate()) {
            return;
        } else {
            this.showDialog = false;
            this.clickedEvent = {
                ...this.changedEvent,
                backgroundColor: this.changedEvent.tag.color,
                borderColor: this.changedEvent.tag.color,
                textColor: '#212121',
            };

            let eventId;

            if (this.clickedEvent.hasOwnProperty('id')) {
                // Update existing event
                eventId = this.clickedEvent.id;
                this.events = this.events.map((i) =>
                    i.id!.toString() === this.clickedEvent.id.toString()
                        ? (i = this.clickedEvent)
                        : i
                );

                // Redirect to lesson student page
                this.router.navigate(['/schoolar/lessons/detail', eventId]);
            } else {
                // Create new event
                eventId = Math.floor(Math.random() * 10000);
                this.events = [
                    ...this.events,
                    {
                        ...this.clickedEvent,
                        id: eventId,
                    },
                ];

                // Redirect to lesson student page for the new event
                this.router.navigate(['/schoolar/lessons/detail', eventId]);
            }

            this.clickedEvent = null;
        }
    }

    onEditClick() {
        this.view = 'edit';
    }

    delete() {
        this.events = this.events.filter(
            (i) => i.id!.toString() !== this.clickedEvent.id.toString()
        );
        this.showDialog = false;
    }

    validate() {
        let {start, end} = this.changedEvent;
        return start && end;
    }

    private mapLessonToEvent(lesson: Lesson): Partial<LessonEvent> {
        const start = new Date(lesson.startDatetime as any);
        const end = new Date(lesson.endDatetime as any);
        const status = (lesson.status || '').toString().toLowerCase();
        // Simple color coding based on status
        const tagColor = status === 'canceled' ? '#ef4444' : status === 'active' ? '#22c55e' : '#3b82f6';
        const centerName = typeof lesson.center === 'string' ? lesson.center : (lesson.center as any)?.name;
        const time = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;

        return {
            id: lesson.id,
            title: lesson.title,
            start,
            end,
            backgroundColor: tagColor,
            borderColor: tagColor,
            textColor: '#212121',
            tag: {name: status ? status : 'lesson', color: tagColor},
            extendedProps: {
                teacher: lesson.teacher || '',
                center: centerName || '',
                description: lesson.description || '',
                isOnline: !!lesson.online,
                status: lesson.status?.toString() || undefined,
                time
            }
        } as unknown as Partial<LessonEvent>;
    }

    // Custom Calendar Methods
    initializeCalendarData() {
        this.setCurrentWeek();
        this.loadMonthlyLessons();
    }

    setCurrentWeek() {
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days

        this.currentWeekStart = new Date(today);
        this.currentWeekStart.setDate(today.getDate() + mondayOffset);

        this.currentWeekEnd = new Date(this.currentWeekStart);
        this.currentWeekEnd.setDate(this.currentWeekStart.getDate() + 6);
    }

    loadMonthlyLessons() {
        // Generate monthly calendar grid
        this.generateMonthlyCalendar();

        // Load lessons for the current month
        if (this.classes?.length > 0) {
            this.loadMonthlyLessonsFromData(this.classes);
        }
    }

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

    private extractNamedEntity(value: any): string {
        if (!value) return 'N/A';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            return value.name || value.title || value.username || 'N/A';
        }
        return String(value);
    }

    loadMonthlyLessonsFromData(lessons: Lesson[]) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const nextMonthStart = new Date(year, month + 1, 1);

        const monthLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.startDatetime);
            return lessonDate >= firstDay && lessonDate < nextMonthStart;
        });

        // Assign lessons to calendar days
        this.monthlyCalendarDays.forEach(day => {
            day.lessons = monthLessons.filter(lesson => {
                const lessonDate = new Date(lesson.startDatetime);
                return lessonDate.toDateString() === day.date.toDateString();
            }).map(lesson => ({
                time: new Date(lesson.startDatetime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
                title: lesson.title,
                teacher: this.extractNamedEntity(lesson.teacher),
                group: lesson.level || 'N/A',
                status: this.getStatusLabel(lesson.status),
                statusClass: this.getStatusClass(lesson.status),
                lesson: lesson
            }));
        });
    }

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

    private getDayKey(day: { date?: Date; dayKey?: string }): string {
        if (day.dayKey) {
            return day.dayKey;
        }
        return day.date ? new Date(day.date).toDateString() : '';
    }

    isDayExpanded(day: { date?: Date; dayKey?: string }): boolean {
        const dayKey = this.getDayKey(day);
        return !!dayKey && this.expandedDayLessons.has(dayKey);
    }

    toggleDayLessons(day: { date?: Date; dayKey?: string }): void {
        const dayKey = this.getDayKey(day);
        if (!dayKey) {
            return;
        }
        if (this.expandedDayLessons.has(dayKey)) {
            this.expandedDayLessons.delete(dayKey);
        } else {
            this.expandedDayLessons.add(dayKey);
        }
    }

    getVisibleDayLessons<T extends { lessons: any[]; date?: Date; dayKey?: string }>(day: T): any[] {
        if (!Array.isArray(day.lessons)) {
            return [];
        }

        if (day.lessons.length <= this.maxVisibleLessonsPerDay) {
            return day.lessons;
        }

        if (this.isDayExpanded(day as any)) {
            return day.lessons;
        }

        return day.lessons.slice(0, this.maxVisibleLessonsPerDay);
    }

    getVisibleWeeklyClasses(day: { classes: any[]; dayKey?: string }): any[] {
        if (!Array.isArray(day.classes)) {
            return [];
        }

        if (day.classes.length <= this.maxVisibleLessonsPerDay || this.isDayExpanded(day)) {
            return day.classes;
        }

        return day.classes.slice(0, this.maxVisibleLessonsPerDay);
    }

    loadWeeklyLessonsFromData(lessons: Lesson[]) {
        const weekStart = new Date(this.currentWeekStart);
        const dayAfterWeekEnd = new Date(this.currentWeekEnd);
        dayAfterWeekEnd.setDate(dayAfterWeekEnd.getDate() + 1);

        const weekLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.startDatetime);
            return lessonDate >= weekStart && lessonDate < dayAfterWeekEnd;
        });

        // Create week structure
        this.weeklyLessons = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);

            const dayLessons = weekLessons.filter(lesson => {
                const lessonDate = new Date(lesson.startDatetime);
                return lessonDate.toDateString() === currentDay.toDateString();
            });

            const isToday = currentDay.toDateString() === new Date().toDateString();

            this.weeklyLessons.push({
                day: currentDay.toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit', month: '2-digit'}),
                date: currentDay.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
                dayKey: currentDay.toDateString(),
                isToday,
                classes: dayLessons.map(lesson => ({
                    time: new Date(lesson.startDatetime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    title: lesson.title,
                    teacher: this.extractNamedEntity(lesson.teacher),
                    group: lesson.level || 'N/A',
                    status: this.getStatusLabel(lesson.status),
                    statusClass: this.getStatusClass(lesson.status),
                    lesson: lesson
                }))
            });
        }
    }

    // Navigation methods
    navigatePrevious() {
        if (this.selectedCalendarView === 'week') {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
        } else {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
            this.generateMonthlyCalendar();
        }
        this.loadLessonsFromApi();
    }

    navigateNext() {
        if (this.selectedCalendarView === 'week') {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
        } else {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
            this.generateMonthlyCalendar();
        }
        this.loadLessonsFromApi();
    }

    navigateToday() {
        this.currentDate = new Date();
        this.setCurrentWeek();
        if (this.selectedCalendarView === 'month') {
            this.generateMonthlyCalendar();
        }
        this.loadLessonsFromApi();
    }

    changeView(view: string) {
        this.selectedCalendarView = view;
        if (view === 'month') {
            this.generateMonthlyCalendar();
        }
        this.loadLessonsFromApi();
    }

    getFormattedWeekRange(): string {
        const start = this.currentWeekStart.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
        const end = this.currentWeekEnd.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
        return `Semana de ${start} a ${end}`;
    }

    getFormattedMonth(): string {
        return this.currentDate.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'});
    }

    // Lesson dialog methods
    showLessonDetails(lesson: Lesson) {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        this.hoverTimeout = setTimeout(() => {
            this.selectedLesson = lesson;
            this.lessonDialogVisible.set(true);
        }, 300);
    }

    hideLessonDetails() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        setTimeout(() => {
            if (!this.isDialogHovered) {
                this.lessonDialogVisible.set(false);
                this.selectedLesson = null;
            }
        }, 100);
    }

    keepDialogOpen() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        this.isDialogHovered = true;

        if (this.dialogHoverTimeout) {
            clearTimeout(this.dialogHoverTimeout);
            this.dialogHoverTimeout = null;
        }
    }

    onDialogMouseLeave() {
        this.isDialogHovered = false;

        this.dialogHoverTimeout = setTimeout(() => {
            if (!this.isDialogHovered) {
                this.lessonDialogVisible.set(false);
                this.selectedLesson = null;
            }
        }, 150);
    }

    viewLesson(lessonId: string) {
        this.router.navigate(['/schoolar/lessons', lessonId]).then();
    }


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
                    return 'Atrasada';
                default:
                    return status;
            }
        }
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
                return 'Atrasada';
            default:
                return 'Desconhecido';
        }
    }

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
                    return 'danger';
                case 'POSTPONED':
                    return 'info';
                default:
                    return 'secondary';
            }
        }
        switch (status) {
            case LessonStatus.AVAILABLE:
            case LessonStatus.COMPLETED:
                return 'success';
            case LessonStatus.BOOKED:
            case LessonStatus.SCHEDULED:
                return 'warning';
            case LessonStatus.CANCELLED:
            case LessonStatus.OVERDUE:
                return 'danger';
            case LessonStatus.POSTPONED:
                return 'info';
            default:
                return 'secondary';
        }
    }

    getStudentsString(lesson: Lesson): string {
        if (lesson.students && lesson.students.length > 0) {
            return lesson.students.map(student => student.name || student.toString()).join(', ');
        }
        return 'Nenhum aluno inscrito';
    }

    getMaterialsString(lesson: Lesson): string {
        if (lesson.materials && lesson.materials.length > 0) {
            return lesson.materials.map(material => material.title || material.toString()).join(', ');
        }
        return 'Nenhum material';
    }

    openOnlineLink(link: string) {
        window.open(link, '_blank');
    }
}
