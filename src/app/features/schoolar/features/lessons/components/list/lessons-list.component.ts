import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Lesson } from 'src/app/core/models/academic/lesson';
import { LessonStatus } from 'src/app/core/enums/lesson-status';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectItem } from 'primeng/api';
import { LEVELS } from 'src/app/shared/constants/app';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GlobalTable } from 'src/app/shared/components/tables/global-table/global-table.component';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { RippleModule } from "primeng/ripple";
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { lessonsActions } from "../../../../../../core/store/schoolar/lessons/lessons.actions";
import { selectAllLessons, selectAnyLoading, selectAnyError } from "../../../../../../core/store/schoolar/lessons/lessons.selectors";
import { takeUntil } from 'rxjs/operators';
import { LESSON_COLUMNS, LESSONS_GLOBAL_FILTER_FIELDS } from "./lessons.constants";
import { LessonState } from "../../../../../../core/store/schoolar/lessons/lesson.state";
import { LessonReports } from "../../../reports/components/lessons/lesson-reports.component";
import { CalendarModule } from 'primeng/calendar';
import { BadgeModule } from 'primeng/badge';

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

        /* Lesson Details Dialog Styles */
        ::ng-deep .lesson-details-dialog {
            z-index: 9999;
        }

        ::ng-deep .lesson-details-dialog .p-dialog {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            overflow: hidden;
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
    lesson: Lesson = {} as Lesson;

    lessons$: Observable<Lesson[]>;

    classes: Lesson[] = [];

    loading$: Observable<boolean>;

    error$: Observable<string | null>;

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
    @ViewChild('mainHeader', { static: false })
    mainHeader!: ElementRef;

    @ViewChild('viewSelector', { static: false })
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

    // Dialog state
    lessonDialogVisible: boolean = false;
    selectedLesson: Lesson | null = null;
    private hoverTimeout: any = null;

    @ViewChild("startDatetime", { static: true })
    startDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("endDatetime", { static: true })
    endDatetimeTemplate?: TemplateRef<any>;

    @ViewChild("actionsTemplate", { static: true })
    actionsTemplate?: TemplateRef<any>;

    @ViewChild("teacherTemplate", { static: true })
    teacherTemplate?: TemplateRef<any>;

    @ViewChild("centerTemplate", { static: true })
    centerTemplate?: TemplateRef<any>;

    @ViewChild("unitTemplate", { static: true })
    unitTemplate?: TemplateRef<any>;

    @ViewChild("statusTemplate", { static: true })
    statusTemplate?: TemplateRef<any>;

    columnTemplates: Record<string, TemplateRef<any>> = {}

    private destroy$ = new Subject<void>();

    // Method to handle view selection
    onViewChange(event: any) {
        this.currentView = event.value;
        if (this.currentView === 'calendario') {
            this.initializeCalendarData();
            // Load calendar data with current lessons
            if (this.classes?.length > 0) {
                this.loadWeeklyLessonsFromData(this.classes);
            }
        }
    }

    // Calendar methods
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
        // Load real data for new period
        if (this.classes?.length > 0) {
            this.loadWeeklyLessonsFromData(this.classes);
        }
    }

    navigateNext() {
        if (this.calendarView === 'week') {
            this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
            this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        // Load real data for new period
        if (this.classes?.length > 0) {
            this.loadWeeklyLessonsFromData(this.classes);
        }
    }

    navigateToday() {
        this.currentDate = new Date();
        this.setCurrentWeek();
        // Load real data for today
        if (this.classes?.length > 0) {
            this.loadWeeklyLessonsFromData(this.classes);
        }
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
        this.lessons$ = this.store.select(selectAllLessons);
        this.loading$ = this.store.select(selectAnyLoading);
        this.error$ = this.store.select(selectAnyError);
    }

    ngOnInit(): void {
        this.store.dispatch(lessonsActions.loadLessons());
        this.initializeCalendarData();

        // Subscribe to lessons for calendar view
        this.lessons$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(lessons => {
            this.classes = lessons;
            if (this.currentView === 'calendario') {
                this.loadWeeklyLessonsFromData(lessons);
            }
        });
    }

    ngAfterViewInit() {
        this.columnTemplates = {
            startDatetime: this.startDatetimeTemplate!,
            endDatetime: this.endDatetimeTemplate!,
            teacherId: this.teacherTemplate!,
            centerId: this.centerTemplate!,
            unitId: this.unitTemplate!,
            status: this.statusTemplate!,
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

        // Clean up hover timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }
    }

    navigateToCreateLesson() {
        this.router.navigate(['/schoolar/lessons/create']).then();
    }

    /**
     * Retry loading lessons
     */
    retryLoadLessons() {
        this.store.dispatch(lessonsActions.loadLessons());
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
            this.lessonDialogVisible = true;
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

        // Hide dialog immediately
        this.lessonDialogVisible = false;
        this.selectedLesson = null;
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
     * Open online lesson link
     */
    openOnlineLink(link: string) {
        window.open(link, '_blank');
    }

    /**
     * Get teacher name from lesson data
     */
    getTeacherName(lesson: Lesson): string {
        // Priority: teacher name field > teacherId fallback > N/A
        if (lesson.teacher && typeof lesson.teacher === 'string') {
            return lesson.teacher;
        }
        // If teacherId exists but no teacher name, show teacherId as fallback
        if (lesson.teacherId) {
            return lesson.teacherId;
        }
        return 'N/A';
    }

    /**
     * Get center name from lesson data
     */
    getCenterName(lesson: Lesson): string {
        // Priority: center object name > center string > centerId fallback > N/A
        if (lesson.center) {
            if (typeof lesson.center === 'object' && lesson.center.name) {
                return lesson.center.name;
            }
            if (typeof lesson.center === 'string') {
                return lesson.center;
            }
        }
        // If centerId exists but no center name, show centerId as fallback
        if (lesson.centerId) {
            return lesson.centerId;
        }
        return 'N/A';
    }

    /**
     * Get unit name from lesson data
     */
    getUnitName(lesson: Lesson): string {
        // Priority: unit name field > unitId fallback > N/A
        if (lesson.unit && typeof lesson.unit === 'string') {
            return lesson.unit;
        }
        // If unitId exists but no unit name, show unitId as fallback
        if (lesson.unitId) {
            return lesson.unitId;
        }
        return 'N/A';
    }

    /**
     * Get display label for lesson status
     */
    getStatusLabel(status: string | LessonStatus): string {
        if (typeof status === 'string') {
            switch (status.toUpperCase()) {
                case 'AVAILABLE': return 'Disponível';
                case 'BOOKED': return 'Agendada';
                case 'COMPLETED': return 'Concluída';
                case 'CANCELLED': return 'Cancelada';
                case 'SCHEDULED': return 'Agendada';
                case 'POSTPONED': return 'Adiada';
                case 'OVERDUE': return 'Atrasada';
                default: return status;
            }
        }
        // Handle enum values
        switch (status) {
            case LessonStatus.AVAILABLE: return 'Disponível';
            case LessonStatus.BOOKED: return 'Agendada';
            case LessonStatus.COMPLETED: return 'Concluída';
            case LessonStatus.CANCELLED: return 'Cancelada';
            case LessonStatus.SCHEDULED: return 'Agendada';
            case LessonStatus.POSTPONED: return 'Adiada';
            case LessonStatus.OVERDUE: return 'Atrasada';
            default: return 'Desconhecido';
        }
    }

    /**
     * Load weekly lessons from real data
     */
    loadWeeklyLessonsFromData(lessons: Lesson[]) {
        const weekStart = new Date(this.currentWeekStart);
        const weekEnd = new Date(this.currentWeekEnd);

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
            });

            const isToday = currentDay.toDateString() === new Date().toDateString();

            this.weeklyLessons.push({
                day: currentDay.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
                date: currentDay.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                isToday,
                classes: dayLessons.map(lesson => ({
                    time: new Date(lesson.startDatetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    title: lesson.title,
                    teacher: this.getTeacherName(lesson),
                    group: lesson.level || 'N/A',
                    status: this.getStatusLabel(lesson.status),
                    statusClass: this.getStatusClass(lesson.status),
                    lesson: lesson // Include the full lesson object for the dialog
                }))
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
                case 'COMPLETED': return 'success';
                case 'BOOKED':
                case 'SCHEDULED': return 'warning';
                case 'CANCELLED':
                case 'OVERDUE': return 'danger';
                case 'POSTPONED': return 'info';
                default: return 'secondary';
            }
        }
        // Handle enum values
        switch (status) {
            case LessonStatus.AVAILABLE:
            case LessonStatus.COMPLETED: return 'success';
            case LessonStatus.BOOKED:
            case LessonStatus.SCHEDULED: return 'warning';
            case LessonStatus.CANCELLED:
            case LessonStatus.OVERDUE: return 'danger';
            case LessonStatus.POSTPONED: return 'info';
            default: return 'secondary';
        }
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
