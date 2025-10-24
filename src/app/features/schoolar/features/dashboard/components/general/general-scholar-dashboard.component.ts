import {CommonModule} from '@angular/common';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule],
    templateUrl: './general-scholar-dashboard.component.html',
})
export class GeneralScholarDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    pieDataLevels: any;
    pieLevelOptions: any;
    barChartData: any;
    barChartOptions: any;
    dateRange: Date[] | undefined;

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
        this.initBarChart();
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
        this.updateEnrollmentChart(students);
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

    private updateEnrollmentChart(students: Student[]): void {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const currentYear = new Date().getFullYear();
        const enrollmentData = new Array(6).fill(0);
        const dropoutData = new Array(6).fill(0);

        students.forEach(student => {
            if (student.enrollmentDate || student.createdAt) {
                const enrollmentDate = new Date(student.enrollmentDate || student.createdAt!);
                if (enrollmentDate.getFullYear() === currentYear) {
                    const month = enrollmentDate.getMonth();
                    if (month < 6) {
                        enrollmentData[month]++;
                    }
                }
            }

            if ((student.status === StudentStatus.DROPPED_OUT || student.status === StudentStatus.QUIT) && student.updatedAt) {
                const dropoutDate = new Date(student.updatedAt);
                if (dropoutDate.getFullYear() === currentYear) {
                    const month = dropoutDate.getMonth();
                    if (month < 6) {
                        dropoutData[month]++;
                    }
                }
            }
        });

        this.barChartData = {
            labels: months,
            datasets: [
                {
                    label: 'Inscrições',
                    backgroundColor: '#42A5F5',
                    data: enrollmentData,
                },
                {
                    label: 'Alunos Ativos',
                    backgroundColor: '#66BB6A',
                    data: enrollmentData.map((enrollments, index) => {
                        // Simple calculation for demonstration
                        return Math.max(0, enrollments - dropoutData[index]);
                    }),
                },
                {
                    label: 'Desistências',
                    backgroundColor: '#EF5350',
                    data: dropoutData,
                },
            ],
        };
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

    initBarChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.barChartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Inscrições',
                    backgroundColor: documentStyle.getPropertyValue('--primary-800'),
                    data: [150, 200, 180, 220, 240, 250],
                },
                {
                    label: 'Aulas Marcadas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-400'),
                    data: [300, 320, 310, 330, 350, 360],
                },
                {
                    label: 'Desistências',
                    backgroundColor: documentStyle.getPropertyValue('--red-400'),
                    data: [50, 12, 20, 10, 40, 13],
                },
            ],
        };

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
        // Simule ou faça uma chamada para API aqui com base na data
        console.log('Filtrar por:', this.dateRange);
    }
}
