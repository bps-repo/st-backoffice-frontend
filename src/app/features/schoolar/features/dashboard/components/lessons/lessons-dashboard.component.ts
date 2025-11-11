import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, first } from 'rxjs/operators';
import { LessonsDashboardStatistics } from 'src/app/core/models/academic/lessons-dashboard-statistics';
import { StatisticsActions } from 'src/app/core/store/schoolar/statistics/statistics.actions';
import {
    selectLessonsDashboardStatistics,
    selectLoadingLessonsDashboardStatistics
} from 'src/app/core/store/schoolar/statistics/statistics.selectors';

@Component({
    selector: 'app-lessons',
    standalone: true,
    imports: [
        ChartModule,
        CommonModule,
        FormsModule,
        CalendarModule,
        CardModule,
        ButtonModule,
        TableModule,
        SkeletonModule,
        DropdownModule
    ],
    templateUrl: './lessons-dashboard.component.html',
})
export class LessonsDashboardComponent implements OnInit, OnDestroy {
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

    constructor(
        private store: Store,
    ) {}

    ngOnInit(): void {
        // Dispatch action to load lessons dashboard statistics
        this.store.dispatch(StatisticsActions.loadLessonsDashboardStatistics());
        this.loadData();
        this.initCharts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        // Load lessons dashboard statistics from store
        this.lessonsDashboardStatistics$ = this.store.select(selectLessonsDashboardStatistics);
        this.loadingLessonsDashboardStatistics$ = this.store.select(selectLoadingLessonsDashboardStatistics);

        // Build level filter options
        this.levelFilterOptions$ = this.lessonsDashboardStatistics$.pipe(
            map(dashboardStats => {
                if (!dashboardStats || Object.keys(dashboardStats).length === 0) {
                    return [];
                }
                const options: Array<{ label: string; value: string | null }> = [
                    { label: 'Todos os Níveis', value: null }
                ];
                const levels = Object.keys(dashboardStats.lessonsByLevel || {});
                levels.forEach(level => {
                    options.push({ label: level, value: level });
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

        // Update charts when dashboard data changes
        this.lessonsDashboardStatistics$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(dashboardStats => {
            if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                this.updateChartsFromDashboard(dashboardStats);
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
                label: 'Reservas',
                current: booked,
                diff: 0
            },
            {
                label: 'Ausências',
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
                        font: { weight: 500 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição por Estado',
                    font: { size: 16, weight: 'bold' },
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
                        font: { weight: 500 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição por Tipo',
                    font: { size: 16, weight: 'bold' },
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
                        font: { weight: 500 },
                        padding: 20,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição Online/Presencial',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Center bar chart options
        this.barChartCenterOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por Centro',
                    font: { size: 16, weight: 'bold' },
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
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por Nível',
                    font: { size: 16, weight: 'bold' },
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
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por Unidade',
                    font: { size: 16, weight: 'bold' },
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

        // Attendance bar chart options
        this.barChartAttendanceOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por Assiduidade',
                    font: { size: 16, weight: 'bold' },
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
        // Implement filtering logic based on date range
        console.log('Filtering by date range:', this.dateRange);
    }
}
