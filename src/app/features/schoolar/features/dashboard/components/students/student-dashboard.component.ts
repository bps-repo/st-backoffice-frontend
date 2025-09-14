import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { Student, StudentStatus } from 'src/app/core/models/academic/student';
import { selectAllStudents, selectLoading } from 'src/app/core/store/schoolar/students/students.selectors';
import { ScholarStatisticsService } from 'src/app/core/services/scholar-statistics.service';
import { AttendanceService } from 'src/app/core/services/attendance.service';

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
        TableModule
    ],
    templateUrl: './student-dashboard.component.html',
})
export class StudentsDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    students$!: Observable<Student[]>;
    loading$!: Observable<boolean>;
    statistics$!: Observable<any>;

    // Chart data
    pieDataGender: any;
    pieGenderOptions: any;
    pieDataAge: any;
    pieAgeOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    kpis$!: Observable<any[]>;
    topPerformers$!: Observable<any[]>;

    constructor(
        private store: Store,
        private statisticsService: ScholarStatisticsService,
        private attendanceService: AttendanceService
    ) {}

    ngOnInit(): void {
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

        // Load statistics
        this.statistics$ = this.statisticsService.getStatistics();

        // Build KPIs from real data
        this.kpis$ = combineLatest([
            this.students$,
            this.statistics$
        ]).pipe(
            map(([students, stats]) => this.buildKPIs(students, stats))
        );

        // Build top performers from real data
        this.topPerformers$ = this.students$.pipe(
            map(students => this.buildTopPerformers(students))
        );

        // Update charts when data changes
        this.students$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(students => {
            this.updateCharts(students);
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Gender distribution pie chart
        this.pieDataGender = {
            labels: ['Male', 'Female', 'Other'],
            datasets: [
                {
                    data: [45, 52, 3],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--pink-500'),
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--pink-400'),
                        documentStyle.getPropertyValue('--green-400'),
                    ],
                },
            ],
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
                    text: 'Gender Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Age distribution pie chart
        this.pieDataAge = {
            labels: ['Under 18', '18-24', '25-34', '35-44', '45+'],
            datasets: [
                {
                    data: [15, 30, 25, 20, 10],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                    ],
                },
            ],
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
                    text: 'Age Distribution',
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
                    label: 'New Enrollments',
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
                    text: 'Students by Level',
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

    private buildKPIs(students: Student[], stats: any): any[] {
        const total = students.length;
        const active = students.filter(s => s.status === StudentStatus.ACTIVE).length;
        const inactive = students.filter(s => s.status === StudentStatus.INACTIVE).length;
        const pendingPayment = students.filter(s => s.status === StudentStatus.PENDING_PAYMENT).length;

        // Calculate growth rates (mock data for now, in real app would come from stats)
        const totalGrowth = stats?.totalStudentsGrowth || 8;
        const activeGrowth = stats?.activeStudentsGrowth || 5;
        const newEnrollments = stats?.newEnrollments || Math.floor(total * 0.15);
        const newEnrollmentsGrowth = stats?.newEnrollmentsGrowth || 15;
        const completionRate = stats?.completionRate || 85;
        const completionRateGrowth = stats?.completionRateGrowth || 3;

        return [
            {
                label: 'Total Students',
                current: total,
                diff: totalGrowth
            },
            {
                label: 'New Enrollments',
                current: newEnrollments,
                diff: newEnrollmentsGrowth
            },
            {
                label: 'Active Students',
                current: active,
                diff: activeGrowth
            },
            {
                label: 'Completion Rate',
                current: `${completionRate}%`,
                diff: completionRateGrowth
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
        // Mock level calculation - in real app would come from student's level data
        const levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    private calculateAttendance(student: Student): string {
        // Mock attendance calculation - in real app would come from attendance service
        const attendance = 85 + Math.floor(Math.random() * 15);
        return `${attendance}%`;
    }

    private calculateGrade(student: Student, index: number): string {
        // Mock grade calculation - in real app would come from assessment data
        const grades = ['A', 'A-', 'B+', 'B', 'B-'];
        return grades[index % grades.length];
    }

    private updateCharts(students: Student[]): void {
        this.updateGenderChart(students);
        this.updateAgeChart(students);
        this.updateEnrollmentChart(students);
        this.updateLevelChart(students);
    }

    private updateGenderChart(students: Student[]): void {
        const genderCounts = students.reduce((acc, student) => {
            const gender = student.user.gender || 'OTHER';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        this.pieDataGender = {
            labels: Object.keys(genderCounts).map(g =>
                g === 'MALE' ? 'Masculino' : g === 'FEMALE' ? 'Feminino' : 'Outro'
            ),
            datasets: [{
                data: Object.values(genderCounts),
                backgroundColor: [
                    '#42A5F5',
                    '#66BB6A',
                    '#FFA726'
                ]
            }]
        };
    }

    private updateAgeChart(students: Student[]): void {
        const ageGroups = { '0-18': 0, '19-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };

        students.forEach(student => {
            if (student.user.birthdate) {
                const age = new Date().getFullYear() - new Date(student.user.birthdate).getFullYear();
                if (age <= 18) ageGroups['0-18']++;
                else if (age <= 25) ageGroups['19-25']++;
                else if (age <= 35) ageGroups['26-35']++;
                else if (age <= 50) ageGroups['36-50']++;
                else ageGroups['50+']++;
            }
        });

        this.pieDataAge = {
            labels: Object.keys(ageGroups),
            datasets: [{
                data: Object.values(ageGroups),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        };
    }

    private updateEnrollmentChart(students: Student[]): void {
        // Mock enrollment data by month
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const enrollmentData = months.map(() => Math.floor(Math.random() * 50) + 20);

        this.lineChartData = {
            labels: months,
            datasets: [{
                label: 'Novos Alunos',
                data: enrollmentData,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.1)',
                tension: 0.4
            }]
        };
    }

    private updateLevelChart(students: Student[]): void {
        // Mock level distribution
        const levels = ['Iniciante', 'Básico', 'Intermediário', 'Avançado'];
        const levelData = levels.map(() => Math.floor(Math.random() * 100) + 50);

        this.barChartData = {
            labels: levels,
            datasets: [{
                label: 'Número de Alunos',
                data: levelData,
                backgroundColor: '#42A5F5'
            }]
        };
    }
}
