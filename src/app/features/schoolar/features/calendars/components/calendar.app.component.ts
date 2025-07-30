import {
    Component,
    ComponentRef,
    OnInit,
    ViewContainerRef,
    ViewChild,
    ElementRef,
    HostListener,
    AfterViewInit
} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {LESSONS_EVENTS} from 'src/app/shared/constants/lessons';
import {EventTooltipComponent} from 'src/app/shared/components/event-tooltip/event-tooltip.component';
import {LessonEvent} from "../../../../../core/models/academic/lesson-event";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginatorModule} from "primeng/paginator";
import {FullCalendarModule, FullCalendarComponent} from "@fullcalendar/angular";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import {Router} from "@angular/router";
import {TabViewModule} from "primeng/tabview";
import {CardModule} from "primeng/card";
import {SelectButtonModule} from "primeng/selectbutton";
import {KpiIndicatorsComponent, Kpi} from "src/app/shared/kpi-indicator/kpi-indicator.component";

@Component({
    selector: "app-lesson-calendar",
    templateUrl: './calendar.app.component.html',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        PaginatorModule,
        FullCalendarModule,
        DialogModule,
        CalendarModule,
        CommonModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        ButtonModule,
        TooltipModule,
        InputSwitchModule,
        MultiSelectModule,
        TabViewModule,
        CardModule,
        SelectButtonModule,
        KpiIndicatorsComponent
    ],
    styleUrls: ['./calendar.app.component.scss']
})
export class CalendarAppComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
    @ViewChild('mainHeader', {static: false}) mainHeader!: ElementRef;
    @ViewChild('viewSelector', {static: false}) viewSelector!: ElementRef;

    events: Partial<LessonEvent>[] = LESSONS_EVENTS;
    filteredEvents: Partial<LessonEvent>[] = [];

    today: string = '';

    calendarOptions: any = {
        initialView: 'timeGridWeek',
    };

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
        {label: 'Mês', value: 'dayGridMonth'},
        {label: 'Semana', value: 'timeGridWeek'},
        //{label: 'Day', value: 'timeGridDay'},
        {label: 'Lista', value: 'listWeek'}
    ];
    selectedCalendarView: string = 'dayGridMonth';

    // Tab view options (like students list)
    currentView: string = 'calendar'; // Default view is calendar
    viewOptions = [
        {label: 'Calendário', value: 'calendar'},
        {label: 'Relatórios', value: 'reports'},
        {label: 'Configurações', value: 'settings'}
    ];

    // Sticky header state
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Current month/year display
    currentMonthYear: string = '';

    // Filter options
    filterByTeacher: boolean = false;
    filterByCenter: boolean = false;
    filterByClass: boolean = false;

    // Available teachers, centers, and classes for filtering
    teachers: any[] = [];
    centers: any[] = [];
    classes: any[] = [];

    selectedTeachers: any[] = [];
    selectedCenters: any[] = [];
    selectedClasses: any[] = [];

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

    // Listen for scroll events
    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.checkStickyState();
    }

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
    }

    constructor(
        private viewContainerRef: ViewContainerRef,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        // Set today's date in the format YYYY-MM-DD
        const now = new Date();
        this.today = now.toISOString().split('T')[0];

        // Initialize events
        this.filteredEvents = [...this.events];

        // Extract unique tags from events
        this.tags = Array.from(new Set(this.events.map(item => JSON.stringify(item.tag))))
            .map(item => JSON.parse(item));

        // Extract unique teachers, centers, and classes for filtering
        this.extractFilterOptions();

        // Calculate KPI metrics
        this.calculateKpiMetrics();

        // Initialize KPI objects for the KpiIndicatorsComponent
        this.initializeKpis();

        // Initialize calendar options
        this.calendarOptions = {
            initialView: this.selectedCalendarView,
            locale: 'pt-br',
            events: this.filteredEvents,
            slotMinTime: '08:00:00',
            slotMaxTime: '23:00:00',
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            height: 'auto',
            aspectRatio: 1.5, // Better ratio for both desktop and mobile
            handleWindowResize: true,
            stickyHeaderDates: true,
            hiddenDays: [0],
            initialDate: this.today,
            headerToolbar: false, // Remove default header toolbar
            editable: true,
            selectable: true,
            selectMirror: true,
            droppable: true,
            dayMaxEvents: 4,
            moreLinkContent: (args: { num: number }) => {
                return {
                    html: `<span class="show-more-link">mostrar mais...</span>`
                };
            },
            eventClick: (e: MouseEvent) => this.onEventClick(e),
            dateClick: (e: any) => this.onDateClick(e),
            eventContent: (args: any) => this.onEventRender(args),
            eventMouseEnter: this.handleEventMouseEnter.bind(this),
            eventMouseLeave: this.handleEventMouseLeave.bind(this),
            eventDrop: (info: any) => this.handleEventDrop(info),
            eventResize: (info: any) => this.handleEventResize(info),
            themeSystem: this.darkMode ? 'bootstrap5' : 'standard',
            datesSet: (dateInfo: any) => this.updateCurrentMonthYear(dateInfo),
        };
    }

    ngAfterViewInit() {
        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
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
     * Extract unique teachers, centers, and classes from events for filtering
     */
    private extractFilterOptions(): void {
        // Extract unique teachers
        this.teachers = Array.from(new Set(this.events
            .filter(event => event.extendedProps?.teacher)
            .map(event => event.extendedProps?.teacher)))
            .map(teacher => ({label: teacher, value: teacher}));

        // Extract unique centers
        this.centers = Array.from(new Set(this.events
            .filter(event => event.extendedProps?.center)
            .map(event => event.extendedProps?.center)))
            .map(center => ({label: center, value: center}));

        // Extract unique classes
        this.classes = Array.from(new Set(this.events
            .filter(event => event.extendedProps?.classEntity)
            .map(event => event.extendedProps?.classEntity)))
            .map(classEntity => ({label: classEntity, value: classEntity}));
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

    /**
     * Apply filters to events
     */
    applyFilters(): void {
        let filtered = [...this.events];

        // Apply search term filter
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                (event.title && event.title.toLowerCase().includes(searchLower)) ||
                (event.extendedProps?.description && event.extendedProps.description.toLowerCase().includes(searchLower)) ||
                (event.extendedProps?.teacher && event.extendedProps.teacher.toLowerCase().includes(searchLower)) ||
                (event.extendedProps?.center && event.extendedProps.center.toLowerCase().includes(searchLower)) ||
                (event.extendedProps?.classEntity && event.extendedProps.classEntity.toLowerCase().includes(searchLower))
            );
        }

        // Apply tag filter
        if (this.selectedTags && this.selectedTags.length > 0) {
            filtered = filtered.filter(event =>
                this.selectedTags.some(tag =>
                    event.tag && event.tag.name === tag.name
                )
            );
        }

        // Apply teacher filter
        if (this.filterByTeacher && this.selectedTeachers.length > 0) {
            filtered = filtered.filter(event =>
                this.selectedTeachers.some(teacher =>
                    event.extendedProps?.teacher === teacher.value
                )
            );
        }

        // Apply center filter
        if (this.filterByCenter && this.selectedCenters.length > 0) {
            filtered = filtered.filter(event =>
                this.selectedCenters.some(center =>
                    event.extendedProps?.center === center.value
                )
            );
        }

        // Apply class filter
        if (this.filterByClass && this.selectedClasses.length > 0) {
            filtered = filtered.filter(event =>
                this.selectedClasses.some(classEntity =>
                    event.extendedProps?.classEntity === classEntity.value
                )
            );
        }

        this.filteredEvents = filtered;

        // Calculate KPI metrics based on filtered events
        this.calculateKpiMetrics();

        // Update calendar events
        this.calendarOptions = {
            ...this.calendarOptions,
            events: this.filteredEvents
        };
    }

    /**
     * Clear all filters
     */
    clearFilters(): void {
        this.searchTerm = '';
        this.selectedTags = [];
        this.selectedTeachers = [];
        this.selectedCenters = [];
        this.selectedClasses = [];
        this.filterByTeacher = false;
        this.filterByCenter = false;
        this.filterByClass = false;

        this.filteredEvents = [...this.events];

        // Calculate KPI metrics based on filtered events
        this.calculateKpiMetrics();

        // Update calendar events
        this.calendarOptions = {
            ...this.calendarOptions,
            events: this.filteredEvents
        };
    }

    /**
     * Remove a tag from the selected tags
     */
    removeTag(tagName: string): void {
        this.selectedTags = this.selectedTags.filter(t => t.name !== tagName);
        this.applyFilters();
    }

    /**
     * Remove a teacher from the selected teachers
     */
    removeTeacher(teacherValue: string): void {
        this.selectedTeachers = this.selectedTeachers.filter(t => t.value !== teacherValue);
        this.applyFilters();
    }

    /**
     * Remove a center from the selected centers
     */
    removeCenter(centerValue: string): void {
        this.selectedCenters = this.selectedCenters.filter(c => c.value !== centerValue);
        this.applyFilters();
    }

    /**
     * Remove a class from the selected classes
     */
    removeClass(classValue: string): void {
        this.selectedClasses = this.selectedClasses.filter(c => c.value !== classValue);
        this.applyFilters();
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

        // Update calendar theme
        this.calendarOptions = {
            ...this.calendarOptions,
            themeSystem: this.darkMode ? 'bootstrap5' : 'standard'
        };

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
        const options = {month: 'long', year: 'numeric'};
        this.currentMonthYear = date.toLocaleDateString('pt-BR', options);
    }

    /**
     * Navigate to previous period
     */
    navigatePrev(): void {
        const calendarApi = this.calendarComponent?.getApi();
        if (calendarApi) {
            calendarApi.prev();
        }
    }

    /**
     * Navigate to next period
     */
    navigateNext(): void {
        const calendarApi = this.calendarComponent?.getApi();
        if (calendarApi) {
            calendarApi.next();
        }
    }

    /**
     * Navigate to today
     */
    navigateToday(): void {
        const calendarApi = this.calendarComponent?.getApi();
        if (calendarApi) {
            calendarApi.today();
        }
    }

    /**
     * Change calendar view
     */
    changeView(view: string): void {
        this.selectedCalendarView = view;

        // Get calendar API
        const calendarApi = this.calendarComponent?.getApi();
        if (calendarApi) {
            calendarApi.changeView(view);
        }
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

            this.calendarOptions = {
                ...this.calendarOptions,
                ...{events: this.events},
            };
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
        this.calendarOptions = {
            ...this.calendarOptions,
            ...{events: this.events},
        };
        this.showDialog = false;
    }

    validate() {
        let {start, end} = this.changedEvent;
        return start && end;
    }
}
