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
import { Observable, Subject, combineLatest } from 'rxjs';
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
        DropdownModule
    ],
    templateUrl: './student-dashboard.component.html',
})
export class StudentsDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

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
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    kpis$!: Observable<any[]>;
    topPerformers$!: Observable<any[]>;
    
    // Municipality chart filter
    selectedProvinceFilter: string | null = null;
    provinceFilterOptions$!: Observable<Array<{ label: string; value: string | null }>>;

    constructor(
        private store: Store,
    ) {}

    ngOnInit(): void {
        // Dispatch action to load students if not already loaded
        this.store.dispatch(StudentsActions.loadStudents());
        // Dispatch action to load dashboard statistics
        this.store.dispatch(StatisticsActions.loadDashboardStatistics());
        this.loadData();
        this.initCharts();
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
                    options.push({ label: province, value: province });
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
                this.updateChartsFromDashboard(dashboardStats);
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
                }
            },
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
                }
            },
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
    }

    filterData() {
        // Implement filtering logic based on date range
        console.log('Filtering by date range:', this.dateRange);
    }

    private buildKPIsFromDashboard(dashboardStats: StudentDashboardStatistics): any[] {
        const total = dashboardStats.totalStudents;
        const active = dashboardStats.studentsByStatus['ACTIVE'] || 0;
        const inactive = dashboardStats.studentsByStatus['INACTIVE'] || 0;
        const pendingPayment = dashboardStats.studentsByStatus['PENDING_PAYMENT'] || 0;

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
            },
            {
                label: 'Pendentes de Pagamento',
                current: pendingPayment,
                diff: 0
            },
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
                grade: this.calculateGrade(student, index)
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

    private calculateGrade(student: Student, index: number): string {
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

    private updateChartsFromDashboard(dashboardStats: StudentDashboardStatistics): void {
        this.updateStatusChart(dashboardStats);
        this.updateGenderChart(dashboardStats);
        this.updateAgeChart(dashboardStats);
        this.updateProvinceChart(dashboardStats);
        this.updateMunicipalityChart(dashboardStats);
        this.updateAcademicBackgroundChart(dashboardStats);
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
                ]
            }]
        };
    }

    private updateAgeChart(dashboardStats: StudentDashboardStatistics): void {
        const ageLabels = Object.keys(dashboardStats.studentsByAgeRange);
        const ageData = Object.values(dashboardStats.studentsByAgeRange);

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
                ]
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
}
