import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from "primeng/ripple";
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { Student, StudentStatus } from 'src/app/core/models/academic/student';
import { selectAllStudents, selectLoading } from 'src/app/core/store/schoolar/students/students.selectors';
import { ScholarStatisticsService } from 'src/app/core/services/scholar-statistics.service';
import { AttendanceService } from 'src/app/core/services/attendance.service';

interface Report {
    id: string;
    name: string;
    type: string;
    generatedDate: string;
    generatedBy: string;
    status: string;
    description?: string;
    parameters?: { name: string; value: string }[];
    data?: any;
}

@Component({
    selector: 'app-student-report',
    templateUrl: './student-reports.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule,
        ChartModule,
        CardModule
    ]
})
export class StudentReports implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    reportId: string = '';
    report: Report | null = null;
    loading: boolean = true;

    // Data observables
    students$!: Observable<Student[]>;
    loading$!: Observable<boolean>;
    statistics$!: Observable<any>;

    // KPI data
    studentKpis$!: Observable<any[]>;

    // Chart data and options
    attendanceByMonthData: any;
    attendanceByMonthOptions: any;

    studentsByStateData: any;
    studentsByStateOptions: any;

    studentsByLevelData: any;
    studentsByLevelOptions: any;

    // general data - in a real app, this would come from a service
    reports: Report[] = [
        {
            id: '1',
            name: 'Student Performance Report',
            type: 'Performance',
            generatedDate: '2023-01-15',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the performance of students across different levels.',
            parameters: [
                { name: 'Start Date', value: '2023-01-01' },
                { name: 'End Date', value: '2023-01-15' },
                { name: 'Course', value: 'All' }
            ],
            data: {
                labels: ['English', 'Math', 'Science', 'History'],
                datasets: [
                    {
                        label: 'Average Score',
                        data: [75, 82, 68, 90]
                    }
                ]
            }
        },
        {
            id: '2',
            name: 'Class Attendance Report',
            type: 'Attendance',
            generatedDate: '2023-02-20',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the attendance of students in different lessons.',
            parameters: [
                { name: 'Start Date', value: '2023-02-01' },
                { name: 'End Date', value: '2023-02-20' },
                { name: 'Class', value: 'All' }
            ],
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Attendance Rate',
                        data: [95, 88, 92, 90]
                    }
                ]
            }
        },
        {
            id: '3',
            name: 'Financial Summary Report',
            type: 'Financial',
            generatedDate: '2023-03-10',
            generatedBy: 'Admin User',
            status: 'Pending',
            description: 'This report shows the financial summary of the school.',
            parameters: [
                { name: 'Start Date', value: '2023-03-01' },
                { name: 'End Date', value: '2023-03-10' },
                { name: 'Department', value: 'All' }
            ]
        }
    ];

    constructor(
        private route: ActivatedRoute,
        private store: Store,
        private statisticsService: ScholarStatisticsService,
        private attendanceService: AttendanceService
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.route.params.subscribe(params => {
            this.reportId = params['id'];
            this.loadReport();
        });
        this.initChartData();
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
        this.studentKpis$ = combineLatest([
            this.students$,
            this.statistics$
        ]).pipe(
            map(([students, stats]) => this.buildStudentKPIs(students, stats))
        );

        // Update charts when data changes
        this.students$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(students => {
            this.updateCharts(students);
        });
    }

    loadReport(): void {
        // Simulate API call
        setTimeout(() => {
            this.report = this.reports.find(r => r.id === this.reportId) || null;
            this.loading = false;
        }, 500);
    }

    initChartData(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Attendance by Month (Column Chart)
        this.attendanceByMonthData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Frequência (%)',
                    data: [75, 78, 80, 82, 79, 76, 74, 77, 81, 83, 85, 82],
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500')
                }
            ]
        };

        this.attendanceByMonthOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Frequência por Mês',
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

        // Students by State (Pie Chart)
        this.studentsByStateData = {
            labels: ['Activos', 'Inactivos', 'Pagamentos pendentes', 'Pagamentos extendidos', 'Contrato por terminar'],
            datasets: [
                {
                    data: [35, 25, 15, 10, 15],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--orange-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--orange-400')
                    ]
                }
            ]
        };

        this.studentsByStateOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 500 },
                        padding: 20
                    },
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Alunos por Estados',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            }
        };

        // Students by Level (Bar Chart)
        this.studentsByLevelData = {
            labels: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'],
            datasets: [
                {
                    label: 'Número de Alunos',
                    data: [220, 280, 190, 160],
                    backgroundColor: documentStyle.getPropertyValue('--primary-500')
                }
            ]
        };

        this.studentsByLevelOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Distribuição por Nível',
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

    downloadReport(): void {
        // In a real app, this would trigger a download of the report
        console.log('Downloading report:', this.report);
        alert('Report download started');
    }

    regenerateReport(): void {
        // In a real app, this would regenerate the report with the same parameters
        console.log('Regenerating report:', this.report);
        alert('Report regeneration started');
    }

    private buildStudentKPIs(students: Student[], stats: any): any[] {
        const total = students.length;
        const active = students.filter(s => s.status === StudentStatus.ACTIVE).length;
        const inactive = students.filter(s => s.status === StudentStatus.INACTIVE).length;
        const pendingPayment = students.filter(s => s.status === StudentStatus.PENDING_PAYMENT).length;

        // Calculate metrics from real data
        const averageAttendance = this.calculateAverageAttendance(students);
        const newStudents = this.calculateNewStudents(students);
        const retentionRate = this.calculateRetentionRate(students);

        return [
            {
                label: 'Total de Alunos',
                current: total,
                diff: stats?.totalStudentsGrowth || 5
            },
            {
                label: 'Frequência Média',
                current: `${averageAttendance}%`,
                diff: stats?.attendanceGrowth || 3
            },
            {
                label: 'Novos Alunos',
                current: newStudents,
                diff: stats?.newStudentsGrowth || 12
            },
            {
                label: 'Taxa de Retenção',
                current: `${retentionRate}%`,
                diff: stats?.retentionGrowth || -2
            },
        ];
    }

    private calculateAverageAttendance(students: Student[]): number {
        // Mock calculation - in real app would use attendance service
        return Math.floor(75 + Math.random() * 20);
    }

    private calculateNewStudents(students: Student[]): number {
        // Mock calculation - in real app would filter by creation date
        return Math.floor(students.length * 0.1);
    }

    private calculateRetentionRate(students: Student[]): number {
        // Mock calculation - in real app would use historical data
        return Math.floor(80 + Math.random() * 15);
    }

    private updateCharts(students: Student[]): void {
        this.updateAttendanceByMonthChart(students);
        this.updateStudentsByStateChart(students);
        this.updateStudentsByLevelChart(students);
    }

    private updateAttendanceByMonthChart(students: Student[]): void {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        // Mock attendance data - in real app would use attendance service
        const attendanceData = months.map(() => Math.floor(70 + Math.random() * 25));

        this.attendanceByMonthData = {
            labels: months,
            datasets: [{
                label: 'Frequência (%)',
                data: attendanceData,
                backgroundColor: '#42A5F5',
                borderColor: '#42A5F5'
            }]
        };
    }

    private updateStudentsByStateChart(students: Student[]): void {
        const stateCounts = students.reduce((acc, student) => {
            const status = student.status;
            let stateKey = '';

            switch (status) {
                case StudentStatus.ACTIVE:
                    stateKey = 'Activos';
                    break;
                case StudentStatus.INACTIVE:
                    stateKey = 'Inactivos';
                    break;
                case StudentStatus.PENDING_PAYMENT:
                    stateKey = 'Pagamentos pendentes';
                    break;
                default:
                    stateKey = 'Outros';
            }

            acc[stateKey] = (acc[stateKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        this.studentsByStateData = {
            labels: Object.keys(stateCounts),
            datasets: [{
                data: Object.values(stateCounts),
                backgroundColor: [
                    '#42A5F5',
                    '#66BB6A',
                    '#FFA726',
                    '#EF5350'
                ],
                hoverBackgroundColor: [
                    '#42A5F5',
                    '#66BB6A',
                    '#FFA726',
                    '#EF5350'
                ]
            }]
        };
    }

    private updateStudentsByLevelChart(students: Student[]): void {
        // Mock level distribution - in real app would use level data
        const levels = ['Iniciante', 'Básico', 'Intermediário', 'Avançado'];
        const levelData = levels.map(() => Math.floor(Math.random() * 100) + 50);

        this.studentsByLevelData = {
            labels: levels,
            datasets: [{
                label: 'Número de Alunos',
                data: levelData,
                backgroundColor: '#42A5F5'
            }]
        };
    }
}
