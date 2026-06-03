import {CommonModule} from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil, first} from 'rxjs/operators';
import {LessonsDashboardStatistics} from 'src/app/core/models/academic/lessons-dashboard-statistics';
import {StatisticsActions} from 'src/app/core/store/schoolar/statistics/statistics.actions';
import {
    selectLessonsDashboardStatistics,
    selectLoadingLessonsDashboardStatistics
} from 'src/app/core/store/schoolar/statistics/statistics.selectors';
import {Lesson} from 'src/app/core/models/academic/lesson';
import {LessonService} from 'src/app/core/services/lessons/lesson.service';

interface SelectOption {
    label: string;
    value: string | null;
}

interface ActiveFilterChip {
    key: string;
    label: string;
    value: string;
}

@Component({
    selector: 'app-lessons-dashboard',
    standalone: true,
    imports: [
        ChartModule,
        CommonModule,
        FormsModule,
        DatePickerModule,
        CardModule,
        ButtonModule,
        TableModule,
        SkeletonModule,
        DropdownModule,
        InputSwitchModule
    ],
    templateUrl: './lessons-dashboard.component.html',
})
export class LessonsDashboardComponent implements OnInit, OnDestroy {
    private store = inject(Store);
    private lessonService = inject(LessonService);

    private destroy$ = new Subject<void>();

    // Data observables
    lessonsDashboardStatistics$!: Observable<LessonsDashboardStatistics | null>;
    loadingLessonsDashboardStatistics$!: Observable<boolean>;
    kpis$!: Observable<any[]>;

    // Chart data
    pieDataStatus: any;
    pieStatusOptions: any;
    pieDataType: any;
    pieTypeOptions: any;
    pieDataOnline: any;
    pieOnlineOptions: any;
    barChartDataCenter: any;
    barChartCenterOptions: any;
    barChartDataLevel: any;
    barChartLevelOptions: any;
    barChartDataUnit: any;
    barChartUnitOptions: any;
    barChartDataAttendance: any;
    barChartAttendanceOptions: any;

    // UI data
    dateRange: Date[] | undefined;

    // Unit chart filter
    selectedLevelFilter: string | null = null;
    levelFilterOptions$!: Observable<Array<{ label: string; value: string | null }>>;

    // Raw lessons for client-side advanced filtering
    private lessonsCache: Lesson[] = [];

    // Advanced search chart
    showAdvancedSearchChart = false;
    advancedSearchChartData: any;
    advancedSearchChartOptions: any;
    advancedBarsValuePlugin: any;
    filteredLessonsCount = 0;
    private advancedChartRawCounts: number[] = [];

    // Advanced filter state
    selectedStatusAdvanced: string | null = null;
    selectedTypeAdvanced: string | null = null;
    selectedOnlineAdvanced: string | null = null;
    selectedCenterAdvanced: string | null = null;
    selectedLevelAdvanced: string | null = null;
    selectedUnitAdvanced: string | null = null;

    // Advanced filter options
    statusAdvancedOptions: SelectOption[] = [];
    typeAdvancedOptions: SelectOption[] = [];
    onlineAdvancedOptions: SelectOption[] = [
        { label: 'Online', value: 'true' },
        { label: 'Presencial', value: 'false' },
    ];
    centerAdvancedOptions: SelectOption[] = [];
    levelAdvancedOptions: SelectOption[] = [];
    unitAdvancedOptions: SelectOption[] = [];

    get activeAdvancedFilterChips(): ActiveFilterChip[] {
        const chips: ActiveFilterChip[] = [];
        if (this.selectedStatusAdvanced) {
            chips.push({ key: 'status', label: 'Estado', value: this.findOptionLabel(this.statusAdvancedOptions, this.selectedStatusAdvanced) });
        }
        if (this.selectedTypeAdvanced) {
            chips.push({ key: 'type', label: 'Tipo', value: this.findOptionLabel(this.typeAdvancedOptions, this.selectedTypeAdvanced) });
        }
        if (this.selectedOnlineAdvanced !== null) {
            chips.push({ key: 'online', label: 'Modo', value: this.findOptionLabel(this.onlineAdvancedOptions, this.selectedOnlineAdvanced) });
        }
        if (this.selectedCenterAdvanced) {
            chips.push({ key: 'center', label: 'Centro', value: this.selectedCenterAdvanced });
        }
        if (this.selectedLevelAdvanced) {
            chips.push({ key: 'level', label: 'Nivel', value: this.selectedLevelAdvanced });
        }
        if (this.selectedUnitAdvanced) {
            chips.push({ key: 'unit', label: 'Unidade', value: this.selectedUnitAdvanced });
        }
        return chips;
    }

    clearAdvancedFilters(): void {
        this.selectedStatusAdvanced = null;
        this.selectedTypeAdvanced = null;
        this.selectedOnlineAdvanced = null;
        this.selectedCenterAdvanced = null;
        this.selectedLevelAdvanced = null;
        this.selectedUnitAdvanced = null;
        this.applyAdvancedSearchChart();
    }

    onAdvancedFiltersChange(): void {
        this.applyAdvancedSearchChart();
    }

    removeAdvancedFilter(key: string): void {
        switch (key) {
            case 'status': this.selectedStatusAdvanced = null; break;
            case 'type': this.selectedTypeAdvanced = null; break;
            case 'online': this.selectedOnlineAdvanced = null; break;
            case 'center': this.selectedCenterAdvanced = null; break;
            case 'level': this.selectedLevelAdvanced = null; break;
            case 'unit': this.selectedUnitAdvanced = null; break;
        }
        this.applyAdvancedSearchChart();
    }

    private findOptionLabel(options: SelectOption[], value: string | null): string {
        if (!value) return '';
        return options.find(o => o.value === value)?.label || value;
    }

    ngOnInit(): void {
        this.store.dispatch(StatisticsActions.loadLessonsDashboardStatistics());
        this.loadData();
        this.initCharts();

        this.lessonService.getAllLessons().pipe(
            takeUntil(this.destroy$)
        ).subscribe(lessons => {
            this.lessonsCache = lessons;
            this.applyAdvancedSearchChart(lessons);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        this.lessonsDashboardStatistics$ = this.store.select(selectLessonsDashboardStatistics);
        this.loadingLessonsDashboardStatistics$ = this.store.select(selectLoadingLessonsDashboardStatistics);

        // Build level filter options
        this.levelFilterOptions$ = this.lessonsDashboardStatistics$.pipe(
            map(dashboardStats => {
                if (!dashboardStats || Object.keys(dashboardStats).length === 0) {
                    return [];
                }
                const options: Array<{ label: string; value: string | null }> = [
                    {label: 'Todos os Níveis', value: null}
                ];
                const levels = Object.keys(dashboardStats.lessonsByLevel || {});
                levels.forEach(level => {
                    options.push({label: level, value: level});
                });
                return options;
            })
        );

        // Build KPIs from dashboard data
        this.kpis$ = this.lessonsDashboardStatistics$.pipe(
            map(dashboardStats => {
                if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                    return this.buildKPIsFromDashboard(dashboardStats);
                }
                return [];
            })
        );

        // Update charts and advanced filter options when dashboard data changes
        this.lessonsDashboardStatistics$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(dashboardStats => {
            if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                this.updateChartsFromDashboard(dashboardStats);
                this.buildAdvancedFilterOptions(dashboardStats);
            }
        });
    }

    private buildKPIsFromDashboard(dashboardStats: LessonsDashboardStatistics): any[] {
        const total = dashboardStats.totalLessons;
        const available = dashboardStats.lessonsByStatus['AVAILABLE'] || 0;
        const booked = dashboardStats.lessonsByAttendance['BOOKED'] || 0;
        const absent = dashboardStats.lessonsByAttendance['ABSENT'] || 0;

        return [
            {
                label: 'Total de Aulas',
                current: total,
                diff: 0
            },
            {
                label: 'Aulas Disponíveis',
                current: available,
                diff: 0
            },
            {
                label: 'Aulas com marcações',
                current: booked,
                diff: 0
            },
            {
                label: 'Aulas sem marcações',
                current: absent,
                diff: 0
            },
        ];
    }

    private updateChartsFromDashboard(dashboardStats: LessonsDashboardStatistics): void {
        this.updateStatusChart(dashboardStats);
        this.updateTypeChart(dashboardStats);
        this.updateOnlineChart(dashboardStats);
        this.updateCenterChart(dashboardStats);
        this.updateLevelChart(dashboardStats);
        this.updateUnitChart(dashboardStats);
        this.updateAttendanceChart(dashboardStats);
    }

    private updateStatusChart(dashboardStats: LessonsDashboardStatistics): void {
        const statusLabels = Object.keys(dashboardStats.lessonsByStatus).map(status => {
            const statusMap: Record<string, string> = {
                'AVAILABLE': 'Disponível',
                'SCHEDULED': 'Agendada',
                'COMPLETED': 'Completa',
                'CANCELLED': 'Cancelada'
            };
            return statusMap[status] || status;
        });
        const statusData = Object.values(dashboardStats.lessonsByStatus);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataStatus = {
            labels: statusLabels,
            datasets: [{
                data: statusData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--blue-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--red-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--blue-400'),
                    documentStyle.getPropertyValue('--purple-400'),
                    documentStyle.getPropertyValue('--red-400')
                ]
            }]
        };
    }

    private updateTypeChart(dashboardStats: LessonsDashboardStatistics): void {
        const typeLabels = Object.keys(dashboardStats.lessonsByType).map(type => {
            const typeMap: Record<string, string> = {
                'GENERAL': 'Geral',
                'PRIVATE': 'Privada',
                'GROUP': 'Grupo',
                'ONLINE': 'Online'
            };
            return typeMap[type] || type;
        });
        const typeData = Object.values(dashboardStats.lessonsByType);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataType = {
            labels: typeLabels,
            datasets: [{
                data: typeData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--blue-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--orange-500'),
                    documentStyle.getPropertyValue('--purple-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--blue-400'),
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--orange-400'),
                    documentStyle.getPropertyValue('--purple-400')
                ]
            }]
        };
    }

    private updateOnlineChart(dashboardStats: LessonsDashboardStatistics): void {
        const onlineLabels = Object.keys(dashboardStats.lessonsByOnline).map(online => {
            const onlineMap: Record<string, string> = {
                'ONLINE': 'Online',
                'OFFLINE': 'Presencial'
            };
            return onlineMap[online] || online;
        });
        const onlineData = Object.values(dashboardStats.lessonsByOnline);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataOnline = {
            labels: onlineLabels,
            datasets: [{
                data: onlineData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--cyan-500'),
                    documentStyle.getPropertyValue('--teal-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--cyan-400'),
                    documentStyle.getPropertyValue('--teal-400')
                ]
            }]
        };
    }

    private updateCenterChart(dashboardStats: LessonsDashboardStatistics): void {
        const centerLabels = Object.keys(dashboardStats.lessonsByCenter);
        const centerData = Object.values(dashboardStats.lessonsByCenter);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataCenter = {
            labels: centerLabels,
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                data: centerData
            }]
        };
    }

    private updateLevelChart(dashboardStats: LessonsDashboardStatistics): void {
        const levelLabels = Object.keys(dashboardStats.lessonsByLevel);
        const levelData = Object.values(dashboardStats.lessonsByLevel);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataLevel = {
            labels: levelLabels,
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--indigo-500'),
                data: levelData
            }]
        };
    }

    private updateUnitChart(dashboardStats: LessonsDashboardStatistics): void {
        // Flatten the nested structure: { "Level": { "Unit": count } }
        const unitLabels: string[] = [];
        const unitData: number[] = [];

        Object.entries(dashboardStats.lessonsByUnit).forEach(([level, units]) => {
            // Filter by selected level if one is selected
            if (this.selectedLevelFilter && this.selectedLevelFilter !== level) {
                return;
            }

            Object.entries(units).forEach(([unit, count]) => {
                // If filtering by level, show only unit name, otherwise show "Level - Unit"
                const label = this.selectedLevelFilter
                    ? unit
                    : `${level} - ${unit}`;
                unitLabels.push(label);
                unitData.push(count);
            });
        });

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataUnit = {
            labels: unitLabels,
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--teal-500'),
                data: unitData
            }]
        };
    }

    private updateAttendanceChart(dashboardStats: LessonsDashboardStatistics): void {
        const attendanceLabels = Object.keys(dashboardStats.lessonsByAttendance).map(attendance => {
            const attendanceMap: Record<string, string> = {
                'BOOKED': 'Reservado',
                'PRESENT': 'Presente',
                'ABSENT': 'Ausente',
                'CANCELLED': 'Cancelado'
            };
            return attendanceMap[attendance] || attendance;
        });
        const attendanceData = Object.values(dashboardStats.lessonsByAttendance);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataAttendance = {
            labels: attendanceLabels,
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: attendanceData
            }]
        };
    }

    onLevelFilterChange(): void {
        // Update the unit chart when filter changes
        this.lessonsDashboardStatistics$.pipe(
            first(),
            takeUntil(this.destroy$)
        ).subscribe(dashboardStats => {
            if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                this.updateUnitChart(dashboardStats);
            }
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Status distribution pie chart (initial empty data)
        this.pieDataStatus = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        };

        // Type distribution pie chart (initial empty data)
        this.pieDataType = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        };

        // Online distribution pie chart (initial empty data)
        this.pieDataOnline = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        };

        // Center distribution bar chart (initial empty data)
        this.barChartDataCenter = {
            labels: [],
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                data: []
            }]
        };

        // Level distribution bar chart (initial empty data)
        this.barChartDataLevel = {
            labels: [],
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--indigo-500'),
                data: []
            }]
        };

        // Unit distribution bar chart (initial empty data)
        this.barChartDataUnit = {
            labels: [],
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--teal-500'),
                data: []
            }]
        };

        // Attendance distribution bar chart (initial empty data)
        this.barChartDataAttendance = {
            labels: [],
            datasets: [{
                label: 'Número de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: []
            }]
        };

        // Status pie chart options
        this.pieStatusOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {weight: 500},
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição por Estado',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
        };

        // Type pie chart options
        this.pieTypeOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {weight: 500},
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição por Tipo',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
        };

        // Online pie chart options
        this.pieOnlineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {weight: 500},
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição Online/Presencial',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
        };

        // Center bar chart options
        this.barChartCenterOptions = {
            plugins: {
                legend: {
                    labels: {color: textColor}
                },
                title: {
                    display: true,
                    text: 'Aulas por Centro',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        // Level bar chart options
        this.barChartLevelOptions = {
            plugins: {
                legend: {
                    labels: {color: textColor}
                },
                title: {
                    display: true,
                    text: 'Aulas por Nível',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        // Unit bar chart options
        this.barChartUnitOptions = {
            plugins: {
                legend: {
                    labels: {color: textColor}
                },
                title: {
                    display: true,
                    text: 'Aulas por Unidade',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        // Advanced search chart defaults
        this.advancedSearchChartData = {
            labels: [],
            datasets: [{
                type: 'bar',
                label: 'Quantidade de Aulas',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderRadius: 5,
                barPercentage: 0.7,
                categoryPercentage: 0.72,
                data: []
            }]
        };

        this.advancedSearchChartOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor }, position: 'bottom' },
                title: {
                    display: true,
                    text: 'Pesquisa Avancada de Aulas (por Centro)',
                    color: textColor,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const count = this.advancedChartRawCounts[context.dataIndex] ?? 0;
                            return `Aulas: ${count}`;
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
                y: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                    title: { display: true, text: 'Escala Normalizada', color: textColor }
                }
            }
        };

        this.advancedBarsValuePlugin = {
            id: 'lessonAdvancedBarsValuePlugin',
            afterDatasetsDraw: (chart: any) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '600 11px sans-serif';
                ctx.textAlign = 'center';
                chart.data.datasets.forEach((_: any, datasetIndex: number) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta?.data) return;
                    meta.data.forEach((bar: any, index: number) => {
                        const raw = this.advancedChartRawCounts[index] ?? 0;
                        ctx.fillStyle = documentStyle.getPropertyValue('--primary-700') || '#1D4ED8';
                        ctx.fillText(`${raw}`, bar.x, bar.y - 8);
                    });
                });
                ctx.restore();
            }
        };

        // Attendance bar chart options
        this.barChartAttendanceOptions = {
            plugins: {
                legend: {
                    labels: {color: textColor}
                },
                title: {
                    display: true,
                    text: 'Aulas por Assiduidade',
                    font: {size: 16, weight: 'bold'},
                    color: textColor
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }

    filterData() {
        console.log('Filtering by date range:', this.dateRange);
    }

    private buildAdvancedFilterOptions(stats: LessonsDashboardStatistics): void {
        this.statusAdvancedOptions = this.toOptions(
            Object.keys(stats.lessonsByStatus || {}),
            this.mapStatusLabel
        );
        this.typeAdvancedOptions = this.toOptions(
            Object.keys(stats.lessonsByType || {}),
            this.mapTypeLabel
        );
        this.centerAdvancedOptions = this.toOptions(
            Object.keys(stats.lessonsByCenter || {})
        );
        this.levelAdvancedOptions = this.toOptions(
            Object.keys(stats.lessonsByLevel || {})
        );
        const allUnits = Object.values(stats.lessonsByUnit || {}).flatMap(units => Object.keys(units));
        this.unitAdvancedOptions = this.toOptions(
            Array.from(new Set(allUnits)).sort((a, b) => a.localeCompare(b))
        );
    }

    private applyAdvancedSearchChart(lessonsArg?: Lesson[]): void {
        const lessons = lessonsArg ?? this.lessonsCache;
        const filtered = this.filterLessonsByAdvancedCriteria(lessons);
        this.filteredLessonsCount = filtered.length;

        const grouped: Record<string, number> = {};
        for (const lesson of filtered) {
            const label = lesson.center?.name || 'Sem centro';
            grouped[label] = (grouped[label] ?? 0) + 1;
        }

        const labels = Object.keys(grouped);
        const counts = labels.map(l => grouped[l]);
        this.advancedChartRawCounts = counts;

        const max = Math.max(...counts, 0);
        const normalized = counts.map(c => max > 0 ? Math.max(12, Number(((c / max) * 100).toFixed(1))) : 0);

        this.advancedSearchChartData = {
            ...this.advancedSearchChartData,
            labels,
            datasets: [{ ...this.advancedSearchChartData.datasets[0], data: normalized }]
        };
    }

    private filterLessonsByAdvancedCriteria(lessons: Lesson[]): Lesson[] {
        return lessons.filter(lesson => {
            if (this.selectedStatusAdvanced && String(lesson.status) !== this.selectedStatusAdvanced) return false;
            if (this.selectedTypeAdvanced && String(lesson.type) !== this.selectedTypeAdvanced) return false;
            if (this.selectedOnlineAdvanced !== null && String(lesson.online) !== this.selectedOnlineAdvanced) return false;
            if (this.selectedCenterAdvanced && lesson.center?.name !== this.selectedCenterAdvanced) return false;
            if (this.selectedLevelAdvanced) {
                const lessonLevel = lesson.level ?? lesson.unit?.name;
                if (lessonLevel !== this.selectedLevelAdvanced) return false;
            }
            if (this.selectedUnitAdvanced && lesson.unit?.name !== this.selectedUnitAdvanced) return false;
            return true;
        });
    }

    private toOptions(values: string[], labelMapper?: (v: string) => string): SelectOption[] {
        return values.map(v => ({ value: v, label: labelMapper ? labelMapper(v) : v }));
    }

    private mapStatusLabel(value: string): string {
        const map: Record<string, string> = {
            AVAILABLE: 'Disponível', SCHEDULED: 'Agendada', COMPLETED: 'Completa',
            CANCELLED: 'Cancelada', BOOKED: 'Reservada', POSTPONED: 'Adiada',
            TAUGHT: 'Leccionada', NOT_TAUGHT: 'Não Leccionada', RESCHEDULED: 'Reagendada', RESCHEDULE: 'Reagendada'
        };
        return map[value] || value;
    }

    private mapTypeLabel(value: string): string {
        const map: Record<string, string> = {
            GENERAL: 'Geral', GRAMMAR: 'Gramática', VOCABULARY: 'Vocabulário',
            PRONUNCIATION: 'Pronúncia', LISTENING: 'Compreensão Oral', WRITING: 'Escrita',
            SPEAKING: 'Expressão Oral', READING: 'Leitura', CONVERSATION: 'Conversação',
            PRACTICAL: 'Prática', BUSINESS: 'Negócios', OTHER: 'Outro',
            '0': 'Geral', '1': 'Gramática', '2': 'Vocabulário', '3': 'Pronúncia',
            '4': 'Compreensão Oral', '5': 'Escrita', '6': 'Expressão Oral', '7': 'Leitura',
            '8': 'Conversação', '9': 'Prática', '10': 'Negócios', '11': 'Outro'
        };
        return map[value] || value;
    }
}
