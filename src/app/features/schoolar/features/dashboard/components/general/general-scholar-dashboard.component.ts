import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {ButtonModule} from 'primeng/button';
import {SkeletonModule} from 'primeng/skeleton';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Student, StudentStatus } from 'src/app/core/models/academic/student';
import { selectAllStudents, selectLoading } from 'src/app/core/store/schoolar/students/students.selectors';
import { StudentsActions } from 'src/app/core/store/schoolar/students/students.actions';
import { ScholarStatisticsService } from 'src/app/core/services/scholar-statistics.service';

interface Alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, ButtonModule, SkeletonModule],
    templateUrl: './general-scholar-dashboard.component.html',
})
export class GeneralScholarDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    pieDataLevels: any;
    pieLevelOptions: any;
    barChartData: any = {
        labels: [],
        datasets: []
    };
    barChartOptions: any;
    dateRange: Date[] | undefined;
    chartLoading = false;

    // Data observables
    students$!: Observable<Student[]>;
    loading$!: Observable<boolean>;
    statistics$!: Observable<any>;
    kpis$!: Observable<any[]>;

    alerts: Alert[] = [
        {label: 'Inscrição', description: 'Username foi inscrito no curso de Beginning'},
        {label: 'Agendamento de aulas', description: 'Usernamer8374 acabou de agendar uma aula para as 12h'},
        {label: 'Matrícula', description: '15 novos estudantes matriculados pela user2'},
    ];

    constructor(
        private store: Store,
        private statisticsService: ScholarStatisticsService
    ) {
    }

    ngOnInit(): void {
        // Dispatch action to load students if not already loaded
        this.store.dispatch(StudentsActions.loadStudents());
        this.loadData();
        this.initCharts();
        this.initBarChartOptions();
        this.loadMonthlyTrends();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        // Load students data from store
        this.students$ = this.store.select(selectAllStudents);
        this.loading$ = this.store.select(selectLoading);

        // Load statistics
        this.statistics$ = this.statisticsService.getStatistics();

        // Build KPIs from real data
        this.kpis$ = combineLatest([
            this.students$,
            this.statistics$
        ]).pipe(
            map(([students, stats]) => this.buildKPIs(students, stats))
        );

        // Update charts when data changes
        this.students$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(students => {
            this.updateCharts(students);
        });
    }

    private buildKPIs(students: Student[], stats: any): any[] {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyEnrollments = students.filter(student => {
            if (student.enrollmentDate || student.createdAt) {
                const enrollmentDate = new Date(student.enrollmentDate || student.createdAt!);
                return enrollmentDate.getMonth() === currentMonth && enrollmentDate.getFullYear() === currentYear;
            }
            return false;
        }).length;

        const dropouts = students.filter(s =>
            s.status === StudentStatus.DROPPED_OUT || s.status === StudentStatus.QUIT
        ).length;

        return [
            {
                label: 'Inscrições (mês)',
                current: monthlyEnrollments,
                diff: stats?.enrollmentGrowth || 12
            },
            {
                label: 'Total de Alunos',
                current: students.length,
                diff: stats?.totalStudentsGrowth || 4
            },
            {
                label: 'Desistências',
                current: dropouts,
                diff: stats?.dropoutGrowth || -5
            },
            {
                label: 'Alunos Ativos',
                current: students.filter(s => s.status === StudentStatus.ACTIVE).length,
                diff: stats?.activeStudentsGrowth || 8
            },
        ];
    }

    private updateCharts(students: Student[]): void {
        this.updateLevelChart(students);
    }

    private updateLevelChart(students: Student[]): void {
        const levelCounts: {[key: string]: number} = {};

        students.forEach(student => {
            let levelName = 'Não Definido';
            if (student.level && typeof student.level === 'object' && 'name' in student.level) {
                levelName = student.level.name;
            }
            levelCounts[levelName] = (levelCounts[levelName] || 0) + 1;
        });

        const labels = Object.keys(levelCounts);
        const data = Object.values(levelCounts);

        this.pieDataLevels = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#42A5F5',
                    '#66BB6A',
                    '#FFA726',
                    '#EF5350',
                    '#AB47BC'
                ],
                hoverBackgroundColor: [
                    '#1E88E5',
                    '#4CAF50',
                    '#FF9800',
                    '#F44336',
                    '#9C27B0'
                ]
            }]
        };
    }

    private loadMonthlyTrends(): void {
        this.chartLoading = true;

        // Calculate date range for last 6 months if no date range is selected
        const endDate = this.dateRange && this.dateRange[1]
            ? this.dateRange[1]
            : new Date();
        const startDate = this.dateRange && this.dateRange[0]
            ? this.dateRange[0]
            : (() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 5);
                date.setDate(1);
                return date;
            })();

        this.statisticsService.getMonthlyTrends(startDate, endDate, 'month')
            .pipe(
                takeUntil(this.destroy$),
                catchError(error => {
                    console.error('Error loading monthly trends:', error);
                    // Return empty data structure on error
                    return of({
                        labels: [],
                        datasets: []
                    });
                })
            )
            .subscribe(trendsData => {
                if (trendsData && trendsData.labels && trendsData.datasets) {
                    const documentStyle = getComputedStyle(document.documentElement);

                    // Map API datasets to chart format with colors
                    const datasets = trendsData.datasets.map((dataset: any, index: number) => {
                        let backgroundColor = '#42A5F5';
                        if (dataset.label?.toLowerCase().includes('inscrição') || dataset.label?.toLowerCase().includes('enrollment')) {
                            backgroundColor = documentStyle.getPropertyValue('--primary-800') || '#42A5F5';
                        } else if (dataset.label?.toLowerCase().includes('ativo') || dataset.label?.toLowerCase().includes('active')) {
                            backgroundColor = documentStyle.getPropertyValue('--primary-400') || '#66BB6A';
                        } else if (dataset.label?.toLowerCase().includes('desistência') || dataset.label?.toLowerCase().includes('dropout')) {
                            backgroundColor = documentStyle.getPropertyValue('--red-400') || '#EF5350';
                        } else {
                            // Use default colors based on index
                            const colors = [
                                documentStyle.getPropertyValue('--primary-800') || '#42A5F5',
                                documentStyle.getPropertyValue('--primary-400') || '#66BB6A',
                                documentStyle.getPropertyValue('--red-400') || '#EF5350'
                            ];
                            backgroundColor = colors[index] || '#42A5F5';
                        }

                        return {
                            label: dataset.label || `Dataset ${index + 1}`,
                            backgroundColor: backgroundColor,
                            data: dataset.data || []
                        };
                    });

                    this.barChartData = {
                        labels: trendsData.labels || [],
                        datasets: datasets
                    };
                } else {
                    // Fallback empty structure
                    this.barChartData = {
                        labels: [],
                        datasets: []
                    };
                }
                this.chartLoading = false;
            });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieDataLevels = {
            labels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
            datasets: [
                {
                    data: [400, 100, 150, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-200'),
                    ],
                },
            ],
        };

        this.pieLevelOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {weight: 700},
                        padding: 28,
                    },
                    position: 'bottom',
                },
            },
        };
    }

    initBarChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.barChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
            },
        };
    }

    filtrarDados() {
        // Reload monthly trends with new date range
        this.loadMonthlyTrends();
    }
}
