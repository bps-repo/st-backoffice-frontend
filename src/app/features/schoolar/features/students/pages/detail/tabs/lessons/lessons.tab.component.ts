import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {Subject, Observable, takeUntil} from 'rxjs';
import {LessonService} from 'src/app/core/services/lesson.service';
import {Lesson} from 'src/app/core/models/academic/lesson';

interface LessonCalendarView {
    date: string;
    day: string;
    isToday: boolean;
    lessons: LessonDisplayItem[];
}

interface LessonDisplayItem {
    id: string;
    title: string;
    time: string;
    status: string;
    statusClass: string;
    date: string;
    isOnline: boolean;
    onlineLink?: string;
}

@Component({
    selector: 'scholar-student-lessons-tab',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TagModule,
        ButtonModule,
        CalendarModule,
        SelectButtonModule,
        FormsModule,
        BadgeModule,
        TooltipModule
    ],
    templateUrl: 'lessons.tab.component.html',
})
export class StudentLessonsTabComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // View management
    currentView: string = 'list';
    viewOptions = [
        { label: 'Lista', value: 'list' },
        { label: 'Calendário', value: 'calendar' }
    ];

    // Calendar management
    calendarView: 'week' | 'month' = 'week';
    currentDate: Date = new Date();
    currentWeekStart: Date = new Date();
    currentWeekEnd: Date = new Date();

    // Data
    lessons: LessonDisplayItem[] = [];
    loading = false;

    // Calendar views
    weeklyLessons: LessonCalendarView[] = [];
    monthlyLessons: LessonCalendarView[] = [];

    private lessonApiService = inject(LessonService);

    ngOnInit() {
        this.loadLessons();
        this.initializeCalendarData();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Load lessons from API
    loadLessons() {
        this.loading = true;
        this.lessonApiService.getAllLessons()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (lessons: Lesson[]) => {
                    this.lessons = this.transformLessonsForDisplay(lessons);
                    this.loading = false;
                    if (this.currentView === 'calendar') {
                        this.generateCalendarData();
                    }
                },
                error: (error: any) => {
                    console.error('Error loading lessons:', error);
                    this.loading = false;
                    // Fallback to mock data for development
                    this.lessons = this.getMockLessons();
                    if (this.currentView === 'calendar') {
                        this.generateCalendarData();
                    }
                }
            });
    }

    // Transform API lessons to display format
    private transformLessonsForDisplay(lessons: Lesson[]): LessonDisplayItem[] {
        return lessons.map(lesson => ({
            id: lesson.id || '',
            title: lesson.title,
            time: this.formatTime(lesson.startDatetime, lesson.endDatetime),
            status: this.getStatusLabel(lesson.status),
            statusClass: this.getStatusClass(lesson.status),
            date: this.formatDate(lesson.startDatetime),
            isOnline: lesson.online,
            onlineLink: lesson.onlineLink
        }));
    }

    // Helper methods for formatting
    private formatTime(startDatetime: string | Date, endDatetime: string | Date): string {
        const start = new Date(startDatetime);
        const end = new Date(endDatetime);
        return `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    private formatDate(datetime: string | Date): string {
        const date = new Date(datetime);
        return date.toLocaleDateString('pt-BR');
    }

    private getStatusLabel(status: string | any): string {
        const statusString = typeof status === 'string' ? status : String(status);
        const statusMap: Record<string, string> = {
            'AVAILABLE': 'Disponível',
            'SCHEDULED': 'Agendada',
            'COMPLETED': 'Concluída',
            'CANCELLED': 'Cancelada',
            'IN_PROGRESS': 'Em andamento'
        };
        return statusMap[statusString] || statusString;
    }

    private getStatusClass(status: string | any): string {
        const statusString = typeof status === 'string' ? status : String(status);
        const statusClassMap: Record<string, string> = {
            'AVAILABLE': 'success',
            'SCHEDULED': 'info',
            'COMPLETED': 'success',
            'CANCELLED': 'danger',
            'IN_PROGRESS': 'warning'
        };
        return statusClassMap[statusString] || 'info';
    }

    // Mock lessons for fallback
    private getMockLessons(): LessonDisplayItem[] {
        return [
            {
                id: '1',
                title: 'Present Perfect',
                time: '10:00 - 11:30',
                status: 'Concluída',
                statusClass: 'success',
                date: '15/01/2024',
                isOnline: false
            },
            {
                id: '2',
                title: 'Modal Verbs',
                time: '14:00 - 15:30',
                status: 'Agendada',
                statusClass: 'info',
                date: '14/01/2024',
                isOnline: true,
                onlineLink: 'https://zoom.us/j/123456789'
            },
            {
                id: '3',
                title: 'Passive Voice',
                time: '16:00 - 17:30',
                status: 'Disponível',
                statusClass: 'success',
                date: '12/01/2024',
                isOnline: false
            }
        ];
    }

    // View change handlers
    onViewChange(event: any) {
        this.currentView = event.value;
        if (this.currentView === 'calendar') {
            this.generateCalendarData();
        }
    }

    // Calendar methods
    initializeCalendarData() {
        this.setCurrentWeek();
        this.generateCalendarData();
    }

    setCurrentWeek() {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        this.currentWeekStart = firstDayOfWeek;
        this.currentWeekEnd = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    }

    generateCalendarData() {
        if (this.calendarView === 'week') {
            this.generateWeeklyData();
        } else {
            this.generateMonthlyData();
        }
    }

    generateWeeklyData() {
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        this.weeklyLessons = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(this.currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000);
            const dayString = currentDay.toLocaleDateString('pt-BR');
            const isToday = this.isToday(currentDay);

            const dayLessons = this.lessons.filter(lesson =>
                lesson.date === dayString
            );

            this.weeklyLessons.push({
                date: dayString,
                day: `${weekDays[i]} ${currentDay.getDate()}`,
                isToday,
                lessons: dayLessons
            });
        }
    }

    generateMonthlyData() {
        // Monthly view implementation (can be enhanced later)
        this.monthlyLessons = this.weeklyLessons;
    }

    private isToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Calendar navigation
    navigatePrevious() {
        if (this.calendarView === 'week') {
            this.currentWeekStart = new Date(this.currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
            this.currentWeekEnd = new Date(this.currentWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            // Month navigation
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        }
        this.generateCalendarData();
    }

    navigateNext() {
        if (this.calendarView === 'week') {
            this.currentWeekStart = new Date(this.currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            this.currentWeekEnd = new Date(this.currentWeekEnd.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else {
            // Month navigation
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        }
        this.generateCalendarData();
    }

    navigateToday() {
        this.currentDate = new Date();
        this.setCurrentWeek();
        this.generateCalendarData();
    }

    switchCalendarView(view: 'week' | 'month') {
        this.calendarView = view;
        this.generateCalendarData();
    }

    getFormattedWeekRange(): string {
        const startStr = this.currentWeekStart.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short'
        });
        const endStr = this.currentWeekEnd.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        return `${startStr} - ${endStr}`;
    }

    getFormattedMonth(): string {
        return this.currentDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });
    }

    // TrackBy function for performance optimization
    trackByLessonId(index: number, lesson: LessonDisplayItem): string {
        return lesson.id;
    }
}
