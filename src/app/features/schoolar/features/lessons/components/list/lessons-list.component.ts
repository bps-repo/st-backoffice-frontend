import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SelectItem} from 'primeng/api';
import {LEVELS} from 'src/app/shared/constants/app';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {GlobalTable} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {Router, RouterModule} from '@angular/router';
import {ChartModule} from 'primeng/chart';
import {CardModule} from 'primeng/card';
import {RippleModule} from "primeng/ripple";
import {SelectButtonModule} from 'primeng/selectbutton';
import {TooltipModule} from 'primeng/tooltip';
import {lessonsActions} from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import * as LessonsActions from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import {LESSON_COLUMNS, LESSONS_GLOBAL_FILTER_FIELDS} from "./lessons.constants";
import {LessonState} from "../../../../../../core/store/schoolar/lessons/lesson.state";
import {LessonReports} from "../../../reports/components/lessons/lesson-reports.component";
import {CalendarsDashboardComponent} from "../../../calendars/components/dashboard/dashboard.component";
import {CalendarAppComponent} from "../../../calendars/components/calendar.app.component";
import {CalendarModule} from 'primeng/calendar';
import {BadgeModule} from 'primeng/badge';

@Component({
    selector: 'app-lessons',
    imports: [
        GlobalTable,
        DialogModule,
        ToastModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
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
    ],
    templateUrl: './lessons-list.component.html',
    styles: [`
        ::ng-deep .p-selectbutton {
            display: flex;
            flex-wrap: nowrap;
        }

        ::ng-deep .p-selectbutton .p-button {
            margin-right: 0.5rem;
            border: none;
        }

        ::ng-deep .p-selectbutton .p-button:last-child {
            margin-right: 0;
        }

        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding-top: 1rem;
            padding-bottom: 1rem;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .sticky-active {
            background-color: var(--surface-card);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .animate-fade {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .content-sticky {
            position: sticky;
            top: 140px;
            z-index: 90;
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
            min-height: 6rem;
            padding: 0.5rem;
            border-right: 1px solid #e5e7eb;
            cursor: pointer;
            transition: background-color 0.2s ease;
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
    `]
})
export class LessonsListComponent implements OnInit, OnDestroy, AfterViewInit {
    lesson: Lesson = {} as Lesson;

    lessons$: Observable<Lesson[]>;

    classes: Lesson[] = [];

    loading$: Observable<boolean>;

    selected: SelectItem[] = [];

    types: any[] = ['VIP', 'Online', 'In Center'];

    levels = LEVELS;

    columns: any[] = LESSON_COLUMNS;

    globalFilterFields: string[] = LESSONS_GLOBAL_FILTER_FIELDS;

    // View selection
    currentView: string = 'list'; // Default view is list

    viewOptions = [
        { label: 'Lista de Aulas', value: 'list' },
        { label: 'Calendário', value: 'calendario' },
        { label: 'Relatórios', value: 'relatorios' },
        { label: 'Estatísticas', value: 'estatisticas' },
        { label: 'Nova Aula', value: 'nova-aula' }
    ];

    // References to sticky header elements
    @ViewChild('mainHeader', {static: false})
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', {static: false})
    viewSelector!: ElementRef;

    // Sticky state tracking
    isMainHeaderSticky: boolean = false;
    isViewSelectorSticky: boolean = false;

    // Calendar view state
    calendarView: 'week' | 'month' = 'week';
    currentDate: Date = new Date();
    currentWeekStart: Date = new Date();
    currentWeekEnd: Date = new Date();

    // Sample lesson data for calendar
    weeklyLessons: any[] = [];
    monthlyLessons: any[] = [];

    @ViewChild("startDatetime", {static: true})
    startDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("endDatetime", {static: true})
    endDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("actionsTemplate", {static: true})
    actionsTemplate?: TemplateRef<any>;

    columnTemplates: Record<string, TemplateRef<any>> = {}

    private destroy$ = new Subject<void>();

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
        if (this.currentView === 'calendario') {
            this.initializeCalendarData();
        }
    }

    // Calendar methods
    initializeCalendarData() {
        this.setCurrentWeek();
        this.loadWeeklyLessons();
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

    loadWeeklyLessons() {
        // Sample data for weekly view - in real app, load from service
        this.weeklyLessons = [
            {
                day: 'Mon 14/07',
                date: '14/07',
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    },
                    {
                        time: '14:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    },
                    {
                        time: '16:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    }
                ]
            },
            {
                day: 'Tue 15/07',
                date: '15/07',
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    },
                    {
                        time: '14:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    }
                ]
            },
            {
                day: 'Wed 16/07',
                date: '16/07',
                isToday: true,
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    },
                    {
                        time: '14:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    }
                ]
            },
            {
                day: 'Thu 17/07',
                date: '17/07',
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    }
                ]
            },
            {
                day: 'Fri 18/07',
                date: '18/07',
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    },
                    {
                        time: '14:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    }
                ]
            },
            {
                day: 'Sat 19/07',
                date: '19/07',
                classes: [
                    {
                        time: '09:00',
                        title: 'English ...',
                        teacher: 'Prof. Maria...',
                        group: 'Turma A',
                        status: 'Concluída',
                        statusClass: 'success'
                    },
                    {
                        time: '14:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    },
                    {
                        time: '16:00',
                        title: 'Business...',
                        teacher: 'Prof. João...',
                        group: 'Turma B',
                        status: 'Pendente',
                        statusClass: 'warning'
                    }
                ]
            }
        ];
    }

    loadMonthlyLessons() {
        // Sample data for monthly view - in real app, load from service
        this.monthlyLessons = [];
    }

    switchCalendarView(view: 'week' | 'month') {
        this.calendarView = view;
    }

    navigatePrevious() {
        if (this.calendarView === 'week') {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        this.loadWeeklyLessons();
    }

    navigateNext() {
        if (this.calendarView === 'week') {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.loadWeeklyLessons();
    }

    navigateToday() {
        this.currentDate = new Date();
        this.setCurrentWeek();
        this.loadWeeklyLessons();
    }

    getFormattedWeekRange(): string {
        const start = this.currentWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const end = this.currentWeekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        return `Semana de ${start} a ${end}`;
    }

    getFormattedMonth(): string {
        return this.currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }

    // Listen for scroll events
    @HostListener('window:scroll', ['$event'])
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

    constructor(
        private store: Store<LessonState>,
        private router: Router
    ) {
        this.lessons$ = store.select(LessonsActions.selectAllLessons)
        this.loading$ = store.select(LessonsActions.selectLoadingLessons);
    }

    ngOnInit(): void {
        this.store.dispatch(lessonsActions.loadLessons());
        this.lessons$ = this.store.select(LessonsActions.selectAllLessons);
        this.loading$ = this.store.select(LessonsActions.selectAnyLoading);
        this.initializeCalendarData();
    }

    ngAfterViewInit() {
        this.columnTemplates = {
            startDatetime: this.startDatetimeTemplate!,
            endDatetime: this.endDatetimeTemplate!,
            actions: this.actionsTemplate!,
        }

        // Initialize sticky state check after view is initialized
        setTimeout(() => {
            this.checkStickyState();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    navigateToCreateLesson() {
        this.router.navigate(['/schoolar/lessons/create']).then();
    }

    /**
     * Format date for display
     */
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
}
