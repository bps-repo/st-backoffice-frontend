import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LessonService } from 'src/app/core/services/lesson.service';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { Lesson } from 'src/app/core/models/academic/lesson';

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
        SkeletonModule
    ],
    templateUrl: './lessons-dashboard.component.html',
})
export class LessonsDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    lessons$!: Observable<Lesson[]>;
    loading$!: Observable<boolean>;
    kpis$!: Observable<any[]>;
    topLessons$!: Observable<any[]>;

    // Chart data
    pieDataLessonType: any;
    pieLessonTypeOptions: any;
    doughnutDataSubjects: any;
    doughnutSubjectsOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    loading = true;

    constructor(
        private lessonService: LessonService,
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
        // Load lessons data
        this.lessons$ = this.lessonService.getAllLessons();

        // Build KPIs from real data
        this.kpis$ = this.lessons$.pipe(
            map(lessons => this.buildKPIs(lessons))
        );

        // Build top lessons from real data
        this.topLessons$ = this.lessons$.pipe(
            map(lessons => this.buildTopLessons(lessons))
        );

        // Update charts when data changes
        this.lessons$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(lessons => {
            this.updateCharts(lessons);
            this.loading = false;
        });
    }

    private buildKPIs(lessons: Lesson[]): any[] {
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(l => l.status === 'COMPLETE').length;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Mock calculations for other KPIs - in real app would come from additional data
        const avgAttendance = Math.floor(80 + Math.random() * 15);
        const avgDuration = Math.floor(60 + Math.random() * 30);

        return [
            { label: 'Total Lessons', current: totalLessons, diff: 15 },
            { label: 'Completion Rate', current: `${completionRate}%`, diff: 3 },
            { label: 'Avg. Attendance', current: `${avgAttendance}%`, diff: 2 },
            { label: 'Avg. Duration', current: `${avgDuration} min`, diff: 5 },
        ];
    }

    private buildTopLessons(lessons: Lesson[]): any[] {
        // Get top 5 lessons by some metric (for now, use random data enriched with real lesson data)
        return lessons.slice(0, 5).map((lesson, index) => ({
            title: lesson.title || `Lesson ${index + 1}`,
            teacher: lesson.teacher?.name || 'Unknown Teacher',
            students: Math.floor(Math.random() * 30) + 10, // Mock student count
            rating: `${(4.5 + Math.random() * 0.5).toFixed(1)}/5` // Mock rating
        }));
    }

    private updateCharts(lessons: Lesson[]): void {
        this.updateLessonTypeChart(lessons);
        this.updateSubjectsChart(lessons);
        this.updateTrendChart(lessons);
        this.updateRatingsChart(lessons);
    }

    private updateLessonTypeChart(lessons: Lesson[]): void {
        // This would need to be based on actual lesson type data if available
        // For now, keeping mock data structure but could be enhanced with real categorization
        const types = ['Grammar', 'Vocabulary', 'Conversation', 'Reading', 'Writing', 'Listening'];
        const data = types.map(() => Math.floor(Math.random() * 50) + 10);

        this.pieDataLessonType = {
            labels: types,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#EC407A'
                ],
                hoverBackgroundColor: [
                    '#1E88E5', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#E91E63'
                ]
            }]
        };
    }

    private updateSubjectsChart(lessons: Lesson[]): void {
        // Extract subjects from real lesson data or use mock data
        const subjectCounts: {[key: string]: number} = {};

        lessons.forEach(lesson => {
            // This would depend on how subjects are stored in the lesson model
            // For now, using mock logic
            const subjects = ['English', 'Spanish', 'French', 'German', 'Italian', 'Other'];
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            subjectCounts[randomSubject] = (subjectCounts[randomSubject] || 0) + 1;
        });

        const labels = Object.keys(subjectCounts);
        const data = Object.values(subjectCounts);

        if (labels.length === 0) {
            // Fallback to mock data if no real data available
            this.doughnutDataSubjects = {
                labels: ['English', 'Spanish', 'French', 'German', 'Italian', 'Other'],
                datasets: [{
                    data: [40, 25, 15, 10, 5, 5],
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#607D8B']
                }]
            };
        } else {
            this.doughnutDataSubjects = {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#607D8B']
                }]
            };
        }
    }

    private updateTrendChart(lessons: Lesson[]): void {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const scheduledData = new Array(12).fill(0);
        const completedData = new Array(12).fill(0);
        const attendanceData = new Array(12).fill(0);

        lessons.forEach(lesson => {
            if (lesson.startDatetime || lesson.createdAt) {
                const lessonDate = new Date(lesson.startDatetime || lesson.createdAt!);
                if (lessonDate.getFullYear() === currentYear) {
                    const month = lessonDate.getMonth();
                    scheduledData[month]++;

                    if (lesson.status === 'COMPLETE') {
                        completedData[month]++;
                    }

                    // Mock attendance data
                    attendanceData[month] += Math.floor(Math.random() * 20) + 10;
                }
            }
        });

        this.lineChartData = {
            labels: months,
            datasets: [
                {
                    label: 'Lessons Scheduled',
                    data: scheduledData,
                    borderColor: '#42A5F5',
                    tension: 0.4,
                    pointBackgroundColor: '#42A5F5'
                },
                {
                    label: 'Lessons Completed',
                    data: completedData,
                    borderColor: '#66BB6A',
                    tension: 0.4,
                    pointBackgroundColor: '#66BB6A'
                },
                {
                    label: 'Student Attendance',
                    data: attendanceData,
                    borderColor: '#FFA726',
                    tension: 0.4,
                    pointBackgroundColor: '#FFA726'
                }
            ]
        };
    }

    private updateRatingsChart(lessons: Lesson[]): void {
        // Mock ratings distribution - in real app would come from lesson ratings
        const ratingData = [5, 15, 100, 450, 680];

        this.barChartData = {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Number of Lessons',
                backgroundColor: '#42A5F5',
                data: ratingData
            }]
        };
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Lesson type distribution pie chart
        this.pieDataLessonType = {
            labels: ['Grammar', 'Vocabulary', 'Conversation', 'Reading', 'Writing', 'Listening'],
            datasets: [
                {
                    data: [25, 20, 30, 10, 10, 5],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--pink-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--pink-400'),
                    ],
                },
            ],
        };

        this.pieLessonTypeOptions = {
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
                    text: 'Lesson Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Subject distribution doughnut chart
        this.doughnutDataSubjects = {
            labels: ['English', 'Spanish', 'French', 'German', 'Italian', 'Other'],
            datasets: [
                {
                    data: [40, 25, 15, 10, 5, 5],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--pink-500'),
                        documentStyle.getPropertyValue('--gray-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--cyan-400'),
                        documentStyle.getPropertyValue('--pink-400'),
                        documentStyle.getPropertyValue('--gray-400'),
                    ],
                },
            ],
        };

        this.doughnutSubjectsOptions = {
            cutout: '60%',
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
                    text: 'Lessons by Subject',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Lesson completion trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Lessons Scheduled',
                    data: [95, 100, 110, 105, 95, 90, 85, 100, 120, 130, 140, 150],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Lessons Completed',
                    data: [90, 95, 105, 100, 90, 85, 80, 95, 115, 125, 135, 145],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--green-500')
                },
                {
                    label: 'Student Attendance',
                    data: [85, 90, 95, 92, 85, 80, 75, 90, 105, 115, 125, 135],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--orange-500')
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
                    text: 'Lesson Trends',
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

        // Lesson ratings bar chart
        this.barChartData = {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
                {
                    label: 'Number of Lessons',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [5, 15, 100, 450, 680]
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
                    text: 'Lesson Ratings Distribution',
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
