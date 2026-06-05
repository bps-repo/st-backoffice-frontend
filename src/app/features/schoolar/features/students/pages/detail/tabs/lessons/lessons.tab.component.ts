import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ChangeDetectorRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DropdownModule} from 'primeng/dropdown';
import {BadgeModule} from 'primeng/badge';
import {TooltipModule} from 'primeng/tooltip';
import {DividerModule} from 'primeng/divider';
import {PopoverModule} from 'primeng/popover';
import {Subject, takeUntil, switchMap, of, catchError} from 'rxjs';
import {LessonService} from 'src/app/core/services/lessons/lesson.service';
import {StudentBooking, BookingStatus} from 'src/app/core/models/academic/student-booking';
import { Router } from '@angular/router';

@Component({
    selector: 'scholar-student-lessons-tab',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TagModule,
        ButtonModule,
        DatePickerModule,
        SelectButtonModule,
        DropdownModule,
        BadgeModule,
        TooltipModule,
        DividerModule,
        PopoverModule,
    ],
    templateUrl: 'lessons.tab.component.html',
})
export class StudentLessonsTabComponent implements OnInit, OnChanges, OnDestroy {
    @Input() studentId: string | null = null;

    private destroy$ = new Subject<void>();
    private loadTrigger$ = new Subject<{startDate?: string; endDate?: string; status?: string}>();
    private lessonService = inject(LessonService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    // View
    currentView: string = 'list';
    viewOptions = [
        {label: 'Lista', value: 'list'},
        {label: 'Calendário', value: 'calendar'},
    ];

    // Filters
    dateRange: Date[] | null = null;
    selectedStatus: BookingStatus = 'ALL';
    selectedLessonId: string | null = null;

    readonly statusOptions: {label: string; value: BookingStatus}[] = [
        {label: 'Todos', value: 'ALL'},
        {label: 'Marcada', value: 'BOOKED'},
        {label: 'Cancelada', value: 'CANCELLED'},
        {label: 'Presente', value: 'ATTENDED'},
        {label: 'Falta', value: 'MISSED'},
    ];

    // Data
    bookings: StudentBooking[] = [];
    loading = false;
    error: string | null = null;

    get lessonOptions(): {label: string; value: string}[] {
        const seen = new Set<string>();
        const options: {label: string; value: string}[] = [];
        for (const b of this.bookings) {
            if (!seen.has(b.lesson.id)) {
                seen.add(b.lesson.id);
                options.push({label: b.lesson.title, value: b.lesson.id});
            }
        }
        return options;
    }

    get filteredBookings(): StudentBooking[] {
        if (!this.selectedLessonId) return this.bookings;
        return this.bookings.filter(b => b.lesson.id === this.selectedLessonId);
    }

    // Calendar
    calendarView: 'week' | 'month' = 'week';
    currentWeekStart: Date = new Date();
    currentWeekEnd: Date = new Date();

    ngOnInit(): void {
        this.setDefaultDateRange();

        // Single subscription: switchMap cancels any in-flight request when a new
        // trigger arrives, preventing stale responses and duplicate spinners.
        this.loadTrigger$.pipe(
            switchMap(filters => {
                if (!this.studentId) return of([]);
                return this.lessonService.getStudentBookings(this.studentId, filters).pipe(
                    catchError(() => {
                        this.error = 'Erro ao carregar histórico de aulas.';
                        return of([]);
                    }),
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe(data => {
            this.bookings = data ?? [];
            this.loading = false;
            this.cdr.detectChanges();
        });

        if (this.studentId) {
            this.triggerLoad();
        }
    }

    // firstChange guard prevents the double-call: ngOnChanges fires before ngOnInit
    // on first render, so without this check loadBookings would run twice.
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studentId'] && !changes['studentId'].firstChange && this.studentId) {
            this.setDefaultDateRange();
            this.triggerLoad();
        }
    }

    private setDefaultDateRange(): void {
        const now = new Date();
        this.dateRange = [
            new Date(now.getFullYear(), now.getMonth(), 1),
            new Date(now.getFullYear(), now.getMonth() + 12, 0),
        ];
        this.setWeekFromDate(now);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildFilters(): {startDate?: string; endDate?: string; status?: string} {
        const filters: {startDate?: string; endDate?: string; status?: string} = {};
        if (this.dateRange?.[0]) filters.startDate = this.toIsoDate(this.dateRange[0]);
        if (this.dateRange?.[1]) filters.endDate = this.toIsoDate(this.dateRange[1]);
        if (this.selectedStatus !== 'ALL') filters.status = this.selectedStatus;
        return filters;
    }

    private triggerLoad(): void {
        this.loading = true;
        this.error = null;
        this.loadTrigger$.next(this.buildFilters());
    }

    loadBookings(): void {
        this.triggerLoad();
    }

    clearFilters(): void {
        this.setDefaultDateRange();
        this.selectedStatus = 'ALL';
        this.selectedLessonId = null;
        this.loadBookings();
    }

    exportBookings(): void {
        const rows = this.filteredBookings.map(b => ({
            Aula: b.lesson.title,
            Data: this.formatDate(b.lesson.startDatetime),
            Estado: this.getBookingStatusLabel(b.status),
            Presença: b.attendance ? (b.attendance.present ? 'Presente' : 'Ausente') : '-',
            Nota: b.attendance?.grade ?? '-',
        }));
        const csv = [
            Object.keys(rows[0] ?? {}).join(';'),
            ...rows.map(r => Object.values(r).join(';')),
        ].join('\n');
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historico-aulas.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    onViewChange(event: any): void {
        this.currentView = event.value;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private toIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    formatDateTime(datetime: string): string {
        if (!datetime) return '-';
        const d = new Date(datetime);
        return d.toLocaleString('pt-AO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    formatTime(start: string, end: string): string {
        if (!start || !end) return '-';
        const fmt = (d: Date) => d.toLocaleTimeString('pt-AO', {hour: '2-digit', minute: '2-digit'});
        return `${fmt(new Date(start))} – ${fmt(new Date(end))}`;
    }

    formatDate(datetime: string): string {
        if (!datetime) return '-';
        return new Date(datetime).toLocaleDateString('pt-AO', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        });
    }

    getBookingStatusLabel(status: string): string {
        const map: Record<string, string> = {
            BOOKED: 'Marcada',
            CANCELLED: 'Cancelada',
            ATTENDED: 'Presente',
            MISSED: 'Falta',
        };
        return map[status] ?? status;
    }

    getBookingStatusSeverity(status: string): string {
        const map: Record<string, string> = {
            BOOKED: 'info',
            CANCELLED: 'danger',
            ATTENDED: 'success',
            MISSED: 'warn',
        };
        return map[status] ?? 'secondary';
    }

    getAttendanceSeverity(present: boolean): string {
        return present ? 'success' : 'warn';
    }

    getLessonStatusLabel(status: string): string {
        const map: Record<string, string> = {
            AVAILABLE: 'Disponível',
            SCHEDULED: 'Agendada',
            COMPLETED: 'Concluída',
            CANCELLED: 'Cancelada',
            IN_PROGRESS: 'A decorrer',
        };
        return map[status] ?? status;
    }

    // ── Calendar ─────────────────────────────────────────────────────────────

    private setWeekFromDate(date: Date): void {
        const d = new Date(date);
        const day = d.getDay();
        this.currentWeekStart = new Date(d.setDate(d.getDate() - day));
        this.currentWeekEnd = new Date(this.currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    }

    get weekDays(): {label: string; date: string; isToday: boolean; bookings: StudentBooking[]}[] {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const today = new Date().toDateString();
        return Array.from({length: 7}, (_, i) => {
            const d = new Date(this.currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = this.toIsoDate(d);
            return {
                label: `${days[i]} ${d.getDate()}`,
                date: dateStr,
                isToday: d.toDateString() === today,
                bookings: this.bookings.filter(b => b.lesson.startDatetime?.startsWith(dateStr)),
            };
        });
    }

    getFormattedWeekRange(): string {
        const opts: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'short'};
        const start = this.currentWeekStart.toLocaleDateString('pt-AO', opts);
        const end = this.currentWeekEnd.toLocaleDateString('pt-AO', {...opts, year: 'numeric'});
        return `${start} – ${end}`;
    }

    navigatePrevious(): void {
        this.currentWeekStart = new Date(this.currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.currentWeekEnd = new Date(this.currentWeekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    navigateNext(): void {
        this.currentWeekStart = new Date(this.currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.currentWeekEnd = new Date(this.currentWeekEnd.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    navigateToday(): void {
        this.setWeekFromDate(new Date());
    }

    trackByBookingId(_: number, b: StudentBooking): string {
        return b.id;
    }

    viewLesson(lessonId: string): void {
        this.router.navigate(['/schoolar/lessons', lessonId]);
    }
}
