import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, first } from 'rxjs/operators';
import { Student, StudentStatus } from 'src/app/core/models/academic/student';
import { selectAllStudents, selectLoading } from 'src/app/core/store/schoolar/students/students.selectors';
import { StudentsActions } from 'src/app/core/store/schoolar/students/students.actions';
import { StudentDashboardStatistics } from 'src/app/core/models/academic/student-dashboard-statistics';
import { StatisticsActions } from 'src/app/core/store/schoolar/statistics/statistics.actions';
import {
    selectDashboardStatistics,
    selectLoadingDashboardStatistics
} from 'src/app/core/store/schoolar/statistics/statistics.selectors';

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
    selector: 'app-students',
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
        DropdownModule,
        InputSwitchModule
    ],
    templateUrl: './student-dashboard.component.html',
})
export class StudentsDashboardComponent implements OnInit, OnDestroy {
    private store = inject(Store);

    private destroy$ = new Subject<void>();
    private studentsCache: Student[] = [];
    private dashboardStatisticsSnapshot: StudentDashboardStatistics | null = null;

    // Data observables
    students$!: Observable<Student[]>;
    loading$!: Observable<boolean>;
    dashboardStatistics$!: Observable<StudentDashboardStatistics | null>;
    loadingDashboardStatistics$!: Observable<boolean>;

    // Chart data
    pieDataGender: any;
    pieGenderOptions: any;
    pieDataStatus: any;
    pieStatusOptions: any;
    pieDataAge: any;
    pieAgeOptions: any;
    barChartDataProvince: any;
    barChartProvinceOptions: any;
    barChartDataMunicipality: any;
    barChartMunicipalityOptions: any;
    barChartDataAcademicBackground: any;
    barChartAcademicBackgroundOptions: any;
    barChartDataLevel: any;
    barChartLevelOptions: any;
    barChartDataCenter: any;
    barChartCenterOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // Monthly enrollments mixed chart (bar + line) and plugin for % changes
    monthlyEnrollmentsData: any;
    monthlyEnrollmentsOptions: any;
    monthlyChangePlugin: any;
    private monthlyPctChanges: Array<number | null> = [];

    // UI data
    dateRange: Date[] | undefined;
    kpis$!: Observable<any[]>;
    topPerformers$!: Observable<any[]>;

    // Municipality chart filter
    selectedProvinceFilter: string | null = null;
    provinceFilterOptions$!: Observable<Array<{ label: string; value: string | null }>>;

    // Advanced search chart (multi-filter)
    showAdvancedSearchChart = false;
    advancedSearchChartData: any;
    advancedSearchChartOptions: any;
    advancedBarsValuePlugin: any;
    filteredStudentsCount = 0;
    private advancedChartRawCounts: number[] = [];
    private advancedChartRawProgress: number[] = [];

    // Advanced filters
    minAgeAdvanced: number | null = null;
    maxAgeAdvanced: number | null = null;
    selectedProvinceAdvanced: string | null = null;
    selectedMunicipalityAdvanced: string | null = null;
    selectedLevelAdvanced: string | null = null;
    selectedUnitAdvanced: string | null = null;
    selectedStatusAdvanced: string | null = null;
    selectedAcademicBackgroundAdvanced: string | null = null;
    selectedCenterAdvanced: string | null = null;
    selectedGenderAdvanced: string | null = null;

    // Advanced filter options
    provinceAdvancedOptions: SelectOption[] = [];
    municipalityAdvancedOptions: SelectOption[] = [];
    levelAdvancedOptions: SelectOption[] = [];
    unitAdvancedOptions: SelectOption[] = [];
    statusAdvancedOptions: SelectOption[] = [];
    academicBackgroundAdvancedOptions: SelectOption[] = [];
    centerAdvancedOptions: SelectOption[] = [];
    genderAdvancedOptions: SelectOption[] = [];

    get activeAdvancedFilterChips(): ActiveFilterChip[] {
        const chips: ActiveFilterChip[] = [];

        if (this.minAgeAdvanced !== null || this.maxAgeAdvanced !== null) {
            const minAge = this.minAgeAdvanced !== null ? this.minAgeAdvanced : '-';
            const maxAge = this.maxAgeAdvanced !== null ? this.maxAgeAdvanced : '-';
            chips.push({ key: 'ageRange', label: 'Idade', value: `${minAge}-${maxAge}` });
        }
        if (this.selectedProvinceAdvanced) {
            chips.push({ key: 'province', label: 'Provincia', value: this.selectedProvinceAdvanced });
        }
        if (this.selectedMunicipalityAdvanced) {
            chips.push({ key: 'municipality', label: 'Municipio', value: this.selectedMunicipalityAdvanced });
        }
        if (this.selectedLevelAdvanced) {
            chips.push({ key: 'level', label: 'Nivel', value: this.selectedLevelAdvanced });
        }
        if (this.selectedUnitAdvanced) {
            chips.push({ key: 'unit', label: 'Unidade', value: this.selectedUnitAdvanced });
        }
        if (this.selectedStatusAdvanced) {
            chips.push({
                key: 'status',
                label: 'Estado',
                value: this.findOptionLabel(this.statusAdvancedOptions, this.selectedStatusAdvanced)
            });
        }
        if (this.selectedAcademicBackgroundAdvanced) {
            chips.push({
                key: 'academicBackground',
                label: 'Formacao',
                value: this.findOptionLabel(this.academicBackgroundAdvancedOptions, this.selectedAcademicBackgroundAdvanced)
            });
        }
        if (this.selectedCenterAdvanced) {
            chips.push({ key: 'center', label: 'Centro', value: this.selectedCenterAdvanced });
        }
        if (this.selectedGenderAdvanced) {
            chips.push({
                key: 'gender',
                label: 'Genero',
                value: this.findOptionLabel(this.genderAdvancedOptions, this.selectedGenderAdvanced)
            });
        }

        return chips;
    }

    clearAdvancedFilters(): void {
        this.minAgeAdvanced = null;
        this.maxAgeAdvanced = null;
        this.selectedProvinceAdvanced = null;
        this.selectedMunicipalityAdvanced = null;
        this.selectedLevelAdvanced = null;
        this.selectedUnitAdvanced = null;
        this.selectedStatusAdvanced = null;
        this.selectedAcademicBackgroundAdvanced = null;
        this.selectedCenterAdvanced = null;
        this.selectedGenderAdvanced = null;

        this.rebuildMunicipalityAdvancedOptions(this.studentsCache, this.dashboardStatisticsSnapshot);
        this.applyAdvancedSearchChart();
    }

    ngOnInit(): void {
        // Dispatch action to load students if not already loaded
        this.store.dispatch(StudentsActions.loadStudents());
        // Dispatch action to load dashboard statistics
        this.store.dispatch(StatisticsActions.loadDashboardStatistics());
        this.loadData();
        this.initCharts();

        // Update monthly enrollments chart when students change
        this.students$.pipe(takeUntil(this.destroy$)).subscribe((students) => {
            if (!Array.isArray(students)) {
                return;
            }

            this.studentsCache = students;
            this.updateMonthlyEnrollmentChart(students);
            this.buildAdvancedFilterOptions(students, this.dashboardStatisticsSnapshot);
            this.applyAdvancedSearchChart(students);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        // Load students data from store
        this.students$ = this.store.select(selectAllStudents);
        this.loading$ = this.store.select(selectLoading);

        // Load dashboard statistics from store
        this.dashboardStatistics$ = this.store.select(selectDashboardStatistics);
        this.loadingDashboardStatistics$ = this.store.select(selectLoadingDashboardStatistics);

        // Build province filter options
        this.provinceFilterOptions$ = this.dashboardStatistics$.pipe(
            map(dashboardStats => {
                if (!dashboardStats || Object.keys(dashboardStats).length === 0) {
                    return [];
                }
                const options: Array<{ label: string; value: string | null }> = [
                    { label: 'Todas as Províncias', value: null }
                ];
                const provinces = Object.keys(dashboardStats.studentsByProvince || {});
                provinces.forEach(province => {
                    options.push({ label: province.toUpperCase(), value: province });
                });
                return options;
            })
        );

        // Build KPIs from dashboard data
        this.kpis$ = this.dashboardStatistics$.pipe(
            map(dashboardStats => {
                if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                    return this.buildKPIsFromDashboard(dashboardStats);
                }
                return [];
            })
        );

        // Build top performers from real data
        this.topPerformers$ = this.students$.pipe(
            map(students => this.buildTopPerformers(students))
        );

        // Update charts when dashboard data changes
        this.dashboardStatistics$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(dashboardStats => {
            if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                this.dashboardStatisticsSnapshot = dashboardStats;
                this.updateChartsFromDashboard(dashboardStats);
                this.buildAdvancedFilterOptions(this.studentsCache, dashboardStats);
            }
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Monthly enrollments chart defaults
        const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        this.monthlyEnrollmentsData = {
            labels: monthLabels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Matrículas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: new Array(12).fill(0),
                    borderRadius: 4,
                    order: 1,
                },
                {
                    type: 'line',
                    label: 'Tendência',
                    data: new Array(12).fill(0),
                    borderColor: documentStyle.getPropertyValue('--cyan-500'),
                    backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                    tension: 0.3,
                    pointRadius: 3,
                    fill: false,
                    order: 0,
                }
            ]
        };
        this.monthlyEnrollmentsOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    },
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Matrículas Mensais',
                    color: textColor,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (ctx: any) => {
                            const label = ctx.dataset.label || '';
                            const value = ctx.parsed.y ?? ctx.parsed;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder }
                }
            }
        };

        // Plugin to render % change labels between months
        this.monthlyChangePlugin = {
            id: 'monthlyChange',
            afterDatasetsDraw: (chart: any) => {
                const ctx = chart.ctx;
                const metaBar = chart.getDatasetMeta(0);
                if (!metaBar || !metaBar.data) return;
                const deltas = this.monthlyPctChanges || [];
                ctx.save();
                ctx.font = '12px sans-serif';
                for (let i = 1; i < metaBar.data.length; i++) {
                    const left = metaBar.data[i - 1];
                    const right = metaBar.data[i];
                    if (!left || !right) continue;
                    const midX = (left.x + right.x) / 2;
                    const topY = Math.min(left.y, right.y) - 12;
                    const delta = deltas[i] as number | null;
                    if (delta === null || delta === undefined) continue;
                    const color = delta >= 0 ? '#22C55E' /* green-500 */ : '#EF4444' /* red-500 */;
                    const text = `${delta > 0 ? '+' : ''}${delta.toFixed(0)}%`;
                    ctx.fillStyle = color;
                    ctx.textAlign = 'center';
                    ctx.fillText(text, midX, topY);
                }
                ctx.restore();
            }
        };

        // Status distribution pie chart (initial empty data)
        this.pieDataStatus = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        };

        // Gender distribution pie chart (initial empty data)
        this.pieDataGender = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        };

        this.pieGenderOptions = {
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
                    text: 'Distribuição por Género',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        label: function(context: any) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        // Age distribution pie chart (initial empty data)
        this.pieDataAge = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]

        };

        // Province distribution bar chart (initial empty data)
        this.barChartDataProvince = {
            labels: [],
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                data: []
            }]
        };

        // Municipality distribution bar chart (initial empty data)
        this.barChartDataMunicipality = {
            labels: [],
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                data: []
            }]
        };

        // Academic background distribution bar chart (initial empty data)
        this.barChartDataAcademicBackground = {
            labels: [],
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--teal-500'),
                data: []
            }]
        };

        // Level distribution bar chart (initial empty data)
        this.barChartDataLevel = {
            labels: [],
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--purple-500'),
                data: []
            }]
        };

        // Center distribution bar chart (initial empty data)
        this.barChartDataCenter = {
            labels: [],
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: []
            }]
        };

        this.pieAgeOptions = {
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
                    text: 'Distribuição por Idade',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        label: function(context: any) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        // Enrollment trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Novas inscrições',
                    data: [65, 59, 80, 81, 56, 55, 40, 55, 72, 78, 95, 120],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Completions',
                    data: [28, 48, 40, 19, 86, 27, 90, 35, 55, 63, 75, 90],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--green-500')
                },
                {
                    label: 'Dropouts',
                    data: [12, 15, 8, 10, 7, 5, 8, 9, 12, 10, 5, 7],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--red-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--red-500')
                }
            ]
        };

        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Student Enrollment Trends',
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

        // Level distribution bar chart
        this.barChartData = {
            labels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
            datasets: [
                {
                    label: 'Number of Students',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [200, 250, 180, 120]
                }
            ]
        };

        this.barChartOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por nível',
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

        // Status distribution pie chart options
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

        // Province distribution bar chart options
        this.barChartProvinceOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por Província',
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

        // Municipality distribution bar chart options
        this.barChartMunicipalityOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por Município',
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

        // Academic background distribution bar chart options
        this.barChartAcademicBackgroundOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por Formação Académica',
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

        // Level distribution bar chart options
        this.barChartLevelOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por Nível',
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

        // Center distribution bar chart options
        this.barChartCenterOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Estudantes por Centro',
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

        // Advanced search chart defaults
        this.advancedSearchChartData = {
            labels: [],
            datasets: [
                {
                    type: 'bar',
                    label: 'Quantidade de Alunos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderRadius: 5,
                    barPercentage: 0.7,
                    categoryPercentage: 0.72,
                    data: []
                },
                {
                    type: 'bar',
                    label: 'Progressao Media (%)',
                    backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                    borderRadius: 5,
                    barPercentage: 0.7,
                    categoryPercentage: 0.72,
                    data: []
                }
            ]
        };

        this.advancedSearchChartOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor },
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Pesquisa Avancada de Alunos (por Nivel)',
                    color: textColor,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const datasetIndex = context.datasetIndex;
                            const itemIndex = context.dataIndex;
                            if (datasetIndex === 0) {
                                const count = this.advancedChartRawCounts[itemIndex] || 0;
                                return `Quantidade: ${count}`;
                            }
                            const progress = this.advancedChartRawProgress[itemIndex] || 0;
                            return `Progressao Media: ${progress.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                    title: {
                        display: true,
                        text: 'Escala Normalizada',
                        color: textColor
                    }
                }
            }
        };

        this.advancedBarsValuePlugin = {
            id: 'advancedBarsValuePlugin',
            afterDatasetsDraw: (chart: any) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '600 11px sans-serif';
                ctx.textAlign = 'center';

                chart.data.datasets.forEach((_: any, datasetIndex: number) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || !meta.data) {
                        return;
                    }

                    meta.data.forEach((barElement: any, index: number) => {
                        const rawValue = datasetIndex === 0
                            ? (this.advancedChartRawCounts[index] ?? 0)
                            : (this.advancedChartRawProgress[index] ?? 0);
                        const label = datasetIndex === 0 ? `${rawValue}` : `${Number(rawValue).toFixed(1)}%`;

                        ctx.fillStyle = datasetIndex === 0
                            ? documentStyle.getPropertyValue('--primary-700') || '#1D4ED8'
                            : documentStyle.getPropertyValue('--cyan-700') || '#0E7490';
                        ctx.fillText(label, barElement.x, barElement.y - 8);
                    });
                });

                ctx.restore();
            }
        };
    }

    private buildKPIsFromDashboard(dashboardStats: StudentDashboardStatistics): any[] {
        const total = dashboardStats.totalStudents;
        const active = dashboardStats.studentsByStatus['ACTIVE'] || 0;
        const inactive = dashboardStats.studentsByStatus['INACTIVE'] || 0;

        return [
            {
                label: 'Total de Estudantes',
                current: total,
                diff: 0
            },
            {
                label: 'Estudantes Activos',
                current: active,
                diff: 0
            },
            {
                label: 'Estudantes Inactivos',
                current: inactive,
                diff: 0
            }
        ];
    }

    private buildTopPerformers(students: Student[]): any[] {
        // Filter active students and sort by some performance metric
        // For now, we'll use a mock calculation based on student data
        return students
            .filter(s => s.status === StudentStatus.ACTIVE)
            .slice(0, 5)
            .map((student, index) => ({
                name: `${student.user.firstname} ${student.user.lastname}`,
                level: this.getStudentLevel(student),
                attendance: this.calculateAttendance(student),
                grade: this.calculateGrade(student)
            }));
    }

    private getStudentLevel(student: Student): string {
        // Get actual level from student data
        if (student.level && typeof student.level === 'object' && 'name' in student.level) {
            return student.level.name;
        }
        return 'N/A';
    }

    private calculateAttendance(student: Student): string {
        // Calculate real attendance from student attendance data
        if (student.attendances && student.attendances.length > 0) {
            const presentCount = student.attendances.filter((attendance: any) => attendance.present === true).length;
            const totalCount = student.attendances.length;
            const percentage = Math.round((presentCount / totalCount) * 100);
            return `${percentage}%`;
        }
        // Default value if no attendance data
        return 'N/A';
    }

private calculateGrade(student: Student): string {
        // Calculate grade based on level progress percentage
        if (student.levelProgressPercentage !== undefined) {
            const progress = student.levelProgressPercentage;
            if (progress >= 90) return 'A';
            if (progress >= 80) return 'B+';
            if (progress >= 70) return 'B';
            if (progress >= 60) return 'B-';
            if (progress >= 50) return 'C+';
            return 'C';
        }
        return 'N/A';
    }

    private updateMonthlyEnrollmentChart(students: Student[]): void {
        if (!this.monthlyEnrollmentsData || !Array.isArray(students)) return;

        // Aggregate by month for the current year
        const now = new Date();
        const year = now.getFullYear();
        const counts = new Array(12).fill(0);

        for (const s of students) {
            const d = s.enrollmentDate ? new Date(s.enrollmentDate) : null;
            if (!d || isNaN(d.getTime())) continue;
            if (d.getFullYear() !== year) continue;
            const m = d.getMonth(); // 0..11
            counts[m] = (counts[m] || 0) + 1;
        }

        // Compute month-to-month percentage change
        const pct: Array<number | null> = new Array(12).fill(null);
        for (let i = 1; i < 12; i++) {
            const prev = counts[i - 1];
            const curr = counts[i];
            if (prev === 0) {
                pct[i] = null; // undefined change from zero base
            } else {
                pct[i] = ((curr - prev) / prev) * 100;
            }
        }
        this.monthlyPctChanges = pct;

        // Update datasets (bar + line)
        if (this.monthlyEnrollmentsData.datasets && this.monthlyEnrollmentsData.datasets.length >= 2) {
            this.monthlyEnrollmentsData = {
                ...this.monthlyEnrollmentsData,
                datasets: [
                    { ...this.monthlyEnrollmentsData.datasets[0], data: counts },
                    { ...this.monthlyEnrollmentsData.datasets[1], data: counts },
                ]
            };
        }
    }

    private updateChartsFromDashboard(dashboardStats: StudentDashboardStatistics): void {
        this.updateStatusChart(dashboardStats);
        this.updateGenderChart(dashboardStats);
        this.updateAgeChart(dashboardStats);
        this.updateProvinceChart(dashboardStats);
        this.updateMunicipalityChart(dashboardStats);
        this.updateAcademicBackgroundChart(dashboardStats);
        this.updateLevelChart(dashboardStats);
        this.updateCenterChart(dashboardStats);
    }

    private updateStatusChart(dashboardStats: StudentDashboardStatistics): void {
        const statusLabels = Object.keys(dashboardStats.studentsByStatus).map(status => {
            const statusMap: Record<string, string> = {
                'ACTIVE': 'Activo',
                'INACTIVE': 'Inactivo',
                'PENDING_PAYMENT': 'Pendente Pagamento',
                'SUSPENDED': 'Suspenso',
                'GRADUATED': 'Graduado'
            };
            return statusMap[status] || status;
        });
        const statusData = Object.values(dashboardStats.studentsByStatus);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataStatus = {
            labels: statusLabels,
            datasets: [{
                data: statusData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--orange-500'),
                    documentStyle.getPropertyValue('--blue-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--red-400'),
                    documentStyle.getPropertyValue('--yellow-400'),
                    documentStyle.getPropertyValue('--orange-400'),
                    documentStyle.getPropertyValue('--blue-400')
                ]
            }]
        };
    }

    private updateGenderChart(dashboardStats: StudentDashboardStatistics): void {
        const genderLabels = Object.keys(dashboardStats.studentsByGender).map(gender => {
            const genderMap: Record<string, string> = {
                'MALE': 'Masculino',
                'FEMALE': 'Feminino',
                'OTHER': 'Outro'
            };
            return genderMap[gender] || gender;
        });
        const genderData = Object.values(dashboardStats.studentsByGender);

        // Find the index of the largest slice to explode it
        const maxIndex = genderData.indexOf(Math.max(...genderData));

        // Create offset array - explode the largest slice
        const offset = genderData.map((_, index) => index === maxIndex ? 10 : 0);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataGender = {
            labels: genderLabels,
            datasets: [{
                data: genderData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--blue-500'),
                    documentStyle.getPropertyValue('--pink-500'),
                    documentStyle.getPropertyValue('--green-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--blue-400'),
                    documentStyle.getPropertyValue('--pink-400'),
                    documentStyle.getPropertyValue('--green-400')
                ],
                borderWidth: 2,
                borderColor: documentStyle.getPropertyValue('--surface-ground'),
                offset: offset
            }]
        };
    }

    private updateAgeChart(dashboardStats: StudentDashboardStatistics): void {
        const ageLabels = Object.keys(dashboardStats.studentsByAgeRange);
        const ageData = Object.values(dashboardStats.studentsByAgeRange);

        // Find the index of the largest slice to explode it
        const maxIndex = ageData.indexOf(Math.max(...ageData));

        // Create offset array - explode the largest slice
        const offset = ageData.map((_, index) => index === maxIndex ? 10 : 0);

        const documentStyle = getComputedStyle(document.documentElement);
        this.pieDataAge = {
            labels: ageLabels,
            datasets: [{
                data: ageData,
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                    documentStyle.getPropertyValue('--teal-500'),
                    documentStyle.getPropertyValue('--orange-500'),
                    documentStyle.getPropertyValue('--yellow-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400'),
                    documentStyle.getPropertyValue('--purple-400'),
                    documentStyle.getPropertyValue('--teal-400'),
                    documentStyle.getPropertyValue('--orange-400'),
                    documentStyle.getPropertyValue('--yellow-400')
                ],
                borderWidth: 2,
                borderColor: documentStyle.getPropertyValue('--surface-ground'),
                offset: offset
            }]
        };
    }

    private updateProvinceChart(dashboardStats: StudentDashboardStatistics): void {
        const provinceLabels = Object.keys(dashboardStats.studentsByProvince);
        const provinceData = Object.values(dashboardStats.studentsByProvince);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataProvince = {
            labels: provinceLabels,
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                data: provinceData
            }]
        };
    }

    private updateMunicipalityChart(dashboardStats: StudentDashboardStatistics): void {
        // Flatten the nested structure: { "Province": { "Municipality": count } }
        const municipalityLabels: string[] = [];
        const municipalityData: number[] = [];

        Object.entries(dashboardStats.studentsByMunicipality).forEach(([province, municipalities]) => {
            // Filter by selected province if one is selected
            if (this.selectedProvinceFilter && this.selectedProvinceFilter !== province) {
                return;
            }

            Object.entries(municipalities).forEach(([municipality, count]) => {
                // If filtering by province, show only municipality name, otherwise show "Province - Municipality"
                const label = this.selectedProvinceFilter
                    ? municipality
                    : `${province} - ${municipality}`;
                municipalityLabels.push(label);
                municipalityData.push(count);
            });
        });

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataMunicipality = {
            labels: municipalityLabels,
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                data: municipalityData
            }]
        };
    }

    onProvinceFilterChange(): void {
        // Update the municipality chart when filter changes
        // Get current value from observable and update chart immediately
        this.dashboardStatistics$.pipe(
            first(),
            takeUntil(this.destroy$)
        ).subscribe(dashboardStats => {
            if (dashboardStats && Object.keys(dashboardStats).length > 0) {
                this.updateMunicipalityChart(dashboardStats);
            }
        });
    }

    onAdvancedProvinceChange(): void {
        this.rebuildMunicipalityAdvancedOptions(this.studentsCache, this.dashboardStatisticsSnapshot);

        const municipalityStillValid = this.municipalityAdvancedOptions.some(
            option => option.value === this.selectedMunicipalityAdvanced
        );
        if (!municipalityStillValid) {
            this.selectedMunicipalityAdvanced = null;
        }

        this.onAdvancedFiltersChange();
    }

    onAdvancedFiltersChange(): void {
        if (
            this.minAgeAdvanced !== null &&
            this.maxAgeAdvanced !== null &&
            this.minAgeAdvanced > this.maxAgeAdvanced
        ) {
            const tmp = this.minAgeAdvanced;
            this.minAgeAdvanced = this.maxAgeAdvanced;
            this.maxAgeAdvanced = tmp;
        }
        this.applyAdvancedSearchChart();
    }

    removeAdvancedFilter(filterKey: string): void {
        switch (filterKey) {
            case 'ageRange':
                this.minAgeAdvanced = null;
                this.maxAgeAdvanced = null;
                break;
            case 'province':
                this.selectedProvinceAdvanced = null;
                this.selectedMunicipalityAdvanced = null;
                this.rebuildMunicipalityAdvancedOptions(this.studentsCache, this.dashboardStatisticsSnapshot);
                break;
            case 'municipality':
                this.selectedMunicipalityAdvanced = null;
                break;
            case 'level':
                this.selectedLevelAdvanced = null;
                break;
            case 'unit':
                this.selectedUnitAdvanced = null;
                break;
            case 'status':
                this.selectedStatusAdvanced = null;
                break;
            case 'academicBackground':
                this.selectedAcademicBackgroundAdvanced = null;
                break;
            case 'center':
                this.selectedCenterAdvanced = null;
                break;
            case 'gender':
                this.selectedGenderAdvanced = null;
                break;
            default:
                break;
        }

        this.onAdvancedFiltersChange();
    }

    private buildAdvancedFilterOptions(
        students: Student[],
        dashboardStats?: StudentDashboardStatistics | null
    ): void {
        const provincesFromStudents = this.getUniqueValues(students.map(student => this.extractProvince(student)));
        const provincesFromStats = Object.keys(dashboardStats?.studentsByProvince || {});
        this.provinceAdvancedOptions = this.toOptions(this.mergeUniqueValues(provincesFromStudents, provincesFromStats));

        this.levelAdvancedOptions = this.toOptions(
            this.getUniqueValues(students.map(student => student.level?.name))
        );
        this.unitAdvancedOptions = this.toOptions(
            this.getUniqueValues(students.map(student => student.currentUnit?.name))
        );
        this.statusAdvancedOptions = this.toOptions(
            this.getUniqueValues(students.map(student => student.status)),
            this.mapStatusLabel
        );

        const backgroundsFromStudents = this.getUniqueValues(
            students.map(student => this.extractAcademicBackground(student))
        );
        const backgroundsFromStats = Object.keys(dashboardStats?.studentsByAcademicBackground || {});
        this.academicBackgroundAdvancedOptions = this.toOptions(
            this.mergeUniqueValues(backgroundsFromStudents, backgroundsFromStats),
            this.mapAcademicBackgroundLabel
        );

        this.centerAdvancedOptions = this.toOptions(
            this.getUniqueValues(students.map(student => student.center?.name))
        );
        this.genderAdvancedOptions = this.toOptions(
            this.getUniqueValues(students.map(student => student.user?.gender)),
            this.mapGenderLabel
        );

        this.rebuildMunicipalityAdvancedOptions(students, dashboardStats);
    }

    private rebuildMunicipalityAdvancedOptions(
        students: Student[],
        dashboardStats?: StudentDashboardStatistics | null
    ): void {
        const filteredByProvince = this.selectedProvinceAdvanced
            ? students.filter(student => this.matchesSelected(this.selectedProvinceAdvanced, this.extractProvince(student)))
            : students;

        const municipalitiesFromStudents = this.getUniqueValues(
            filteredByProvince.map(student => this.extractMunicipality(student))
        );

        const studentsByMunicipality = dashboardStats?.studentsByMunicipality || {};
        let municipalitiesFromStats: string[] = [];

        if (this.selectedProvinceAdvanced) {
            const provinceEntry = Object.entries(studentsByMunicipality).find(([province]) =>
                this.matchesSelected(this.selectedProvinceAdvanced, province)
            );
            municipalitiesFromStats = Object.keys(provinceEntry?.[1] || {});
        } else {
            municipalitiesFromStats = Object.values(studentsByMunicipality)
                .flatMap((municipalityMap) => Object.keys(municipalityMap || {}));
        }

        this.municipalityAdvancedOptions = this.toOptions(
            this.mergeUniqueValues(municipalitiesFromStudents, municipalitiesFromStats)
        );
    }

    private applyAdvancedSearchChart(studentsArg?: Student[]): void {
        const students = studentsArg ?? this.studentsCache;
        const filtered = this.filterStudentsByAdvancedCriteria(students);
        this.filteredStudentsCount = filtered.length;

        const grouped: Record<string, { count: number; progressSum: number; progressItems: number }> = {};

        for (const student of filtered) {
            const levelLabel = student.level?.name || 'Sem nivel';
            if (!grouped[levelLabel]) {
                grouped[levelLabel] = { count: 0, progressSum: 0, progressItems: 0 };
            }

            grouped[levelLabel].count += 1;
            if (typeof student.levelProgressPercentage === 'number') {
                grouped[levelLabel].progressSum += student.levelProgressPercentage;
                grouped[levelLabel].progressItems += 1;
            }
        }

        const labels = Object.keys(grouped);
        const counts = labels.map(label => grouped[label].count);
        const avgProgress = labels.map(label => {
            const { progressSum, progressItems } = grouped[label];
            return progressItems > 0 ? Number((progressSum / progressItems).toFixed(1)) : 0;
        });

        this.advancedChartRawCounts = counts;
        this.advancedChartRawProgress = avgProgress;

        const normalizedCountBars = this.normalizeDatasetForChart(counts);
        const normalizedProgressBars = this.normalizeDatasetForChart(avgProgress);

        this.advancedSearchChartData = {
            ...this.advancedSearchChartData,
            labels,
            datasets: [
                { ...this.advancedSearchChartData.datasets[0], data: normalizedCountBars },
                { ...this.advancedSearchChartData.datasets[1], data: normalizedProgressBars }
            ]
        };
    }

    private getUniqueValues(values: Array<string | null | undefined>): string[] {
        return Array.from(
            new Set(values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0))
        ).sort((a, b) => a.localeCompare(b));
    }

    private toOptions(values: string[], labelMapper?: (value: string) => string): SelectOption[] {
        return values.map(value => ({
            value,
            label: labelMapper ? labelMapper.call(this, value) : value
        }));
    }

    private mapStatusLabel(value: string): string {
        const statusMap: Record<string, string> = {
            ACTIVE: 'Activo',
            INACTIVE: 'Inactivo',
            PENDING_PAYMENT: 'Pendente Pagamento',
            SUSPENDED: 'Suspenso',
            GRADUATED: 'Graduado',
            DROPPED_OUT: 'Desistente',
            QUIT: 'Desistiu'
        };
        return statusMap[value] || value;
    }

    private mapGenderLabel(value: string): string {
        const genderMap: Record<string, string> = {
            MALE: 'Masculino',
            FEMALE: 'Feminino',
            OTHER: 'Outro'
        };
        return genderMap[value] || value;
    }

    private mapAcademicBackgroundLabel(value: string): string {
        const mapLabel: Record<string, string> = {
            PRIMARY_SCHOOL: 'Ensino Primario',
            SECONDARY_SCHOOL: 'Ensino Secundario',
            UNIVERSITY: 'Universidade',
            MASTER: 'Mestrado',
            DOCTORATE: 'Doutoramento'
        };
        return mapLabel[value] || value;
    }

    private normalizeDatasetForChart(values: number[]): number[] {
        const max = Math.max(...values, 0);
        if (max <= 0) {
            return values.map(() => 0);
        }

        return values.map(value => {
            if (value <= 0) {
                return 0;
            }
            return Math.max(12, Number(((value / max) * 100).toFixed(1)));
        });
    }

    private findOptionLabel(options: SelectOption[], value: string | null): string {
        if (!value) {
            return '';
        }
        return options.find(option => option.value === value)?.label || value;
    }

    private filterStudentsByAdvancedCriteria(students: Student[]): Student[] {
        return students.filter(student => {
            const age = this.calculateAgeFromBirthdate(student.user?.birthdate);
            if (this.minAgeAdvanced !== null && (age === null || age < this.minAgeAdvanced)) {
                return false;
            }
            if (this.maxAgeAdvanced !== null && (age === null || age > this.maxAgeAdvanced)) {
                return false;
            }

            if (this.selectedProvinceAdvanced && !this.matchesSelected(this.selectedProvinceAdvanced, this.extractProvince(student))) {
                return false;
            }
            if (this.selectedMunicipalityAdvanced && !this.matchesSelected(this.selectedMunicipalityAdvanced, this.extractMunicipality(student))) {
                return false;
            }
            if (this.selectedLevelAdvanced && student.level?.name !== this.selectedLevelAdvanced) {
                return false;
            }
            if (this.selectedUnitAdvanced && student.currentUnit?.name !== this.selectedUnitAdvanced) {
                return false;
            }
            if (this.selectedStatusAdvanced && student.status !== this.selectedStatusAdvanced) {
                return false;
            }
            if (
                this.selectedAcademicBackgroundAdvanced &&
                !this.matchesSelected(this.selectedAcademicBackgroundAdvanced, this.extractAcademicBackground(student))
            ) {
                return false;
            }
            if (this.selectedCenterAdvanced && student.center?.name !== this.selectedCenterAdvanced) {
                return false;
            }
            if (this.selectedGenderAdvanced && !this.matchesSelected(this.selectedGenderAdvanced, student.user?.gender)) {
                return false;
            }

            return true;
        });
    }

    private mergeUniqueValues(...valueLists: string[][]): string[] {
        return Array.from(new Set(valueLists.flat().map(value => value.trim()).filter(Boolean))).sort((a, b) =>
            a.localeCompare(b)
        );
    }

    private extractProvince(student: Student): string | null {
        const studentAny = student as any;
        return this.firstNonEmpty([
            student.province,
            studentAny.user?.province,
            studentAny.address?.province,
            studentAny.user?.address?.province
        ]);
    }

    private extractMunicipality(student: Student): string | null {
        const studentAny = student as any;
        return this.firstNonEmpty([
            student.municipality,
            studentAny.user?.municipality,
            studentAny.address?.municipality,
            studentAny.user?.address?.municipality
        ]);
    }

    private extractAcademicBackground(student: Student): string | null {
        const studentAny = student as any;
        return this.firstNonEmpty([
            student.academicBackground,
            studentAny.user?.academicBackground
        ]);
    }

    private firstNonEmpty(values: Array<string | null | undefined>): string | null {
        const found = values.find((value): value is string => typeof value === 'string' && value.trim().length > 0);
        return found ? found.trim() : null;
    }

    private normalizeForCompare(value: string | null | undefined): string {
        return (value || '').trim().toUpperCase();
    }

    private matchesSelected(selected: string | null | undefined, current: string | null | undefined): boolean {
        return this.normalizeForCompare(selected) === this.normalizeForCompare(current);
    }

    private calculateAgeFromBirthdate(birthdate: string | undefined): number | null {
        if (!birthdate) {
            return null;
        }

        const dob = new Date(birthdate);
        if (Number.isNaN(dob.getTime())) {
            return null;
        }

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    }


    private updateAcademicBackgroundChart(dashboardStats: StudentDashboardStatistics): void {
        const backgroundLabels = Object.keys(dashboardStats.studentsByAcademicBackground).map(bg => {
            const bgMap: Record<string, string> = {
                'PRIMARY_SCHOOL': 'Ensino Primário',
                'SECONDARY_SCHOOL': 'Ensino Secundário',
                'UNIVERSITY': 'Universidade',
                'MASTER': 'Mestrado',
                'DOCTORATE': 'Doutoramento'
            };
            return bgMap[bg] || bg;
        });
        const backgroundData = Object.values(dashboardStats.studentsByAcademicBackground);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataAcademicBackground = {
            labels: backgroundLabels,
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--teal-500'),
                data: backgroundData
            }]
        };
    }

    private updateLevelChart(dashboardStats: StudentDashboardStatistics): void {
        if (!dashboardStats.studentsByLevel) {
            return;
        }

        const levelLabels = Object.keys(dashboardStats.studentsByLevel);
        const levelData = Object.values(dashboardStats.studentsByLevel);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataLevel = {
            labels: levelLabels,
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--purple-500'),
                data: levelData
            }]
        };
    }

    private updateCenterChart(dashboardStats: StudentDashboardStatistics): void {
        if (!dashboardStats.studentsByCenter) {
            return;
        }

        const centerLabels = Object.keys(dashboardStats.studentsByCenter);
        const centerData = Object.values(dashboardStats.studentsByCenter);

        const documentStyle = getComputedStyle(document.documentElement);
        this.barChartDataCenter = {
            labels: centerLabels,
            datasets: [{
                label: 'Número de Estudantes',
                backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                data: centerData
            }]
        };
    }
}
