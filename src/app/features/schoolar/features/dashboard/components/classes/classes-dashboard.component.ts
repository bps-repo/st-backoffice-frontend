import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ClassService } from 'src/app/core/services/class.service';

@Component({
    selector: 'app-classes',
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
    templateUrl: './dashboard.component.html',
})
export class ClassesDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    classes$!: Observable<any[]>;
    kpis$!: Observable<any[]>;
    topClasses$!: Observable<any[]>;

    // Chart data
    pieDataClassSize: any;
    pieClassSizeOptions: any;
    doughnutDataSubjects: any;
    doughnutSubjectsOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    loading = true;

    constructor(private classService: ClassService) {}

    ngOnInit(): void {
        this.loadData();
        this.initCharts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        this.classes$ = this.classService.getClasses();

        this.kpis$ = this.classes$.pipe(
            map(classes => this.buildKPIs(classes))
        );

        this.topClasses$ = this.classes$.pipe(
            map(classes => this.buildTopClasses(classes))
        );

        this.classes$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(classes => {
            this.updateCharts(classes);
            this.loading = false;
        });
    }

    private buildKPIs(classes: any[]): any[] {
        const totalClasses = classes.length;
        const avgStudents = Math.floor(15 + Math.random() * 10);
        const completionRate = Math.floor(85 + Math.random() * 15);
        const utilization = Math.floor(80 + Math.random() * 15);

        return [
            { label: 'Total Classes', current: totalClasses, diff: 10 },
            { label: 'Average Students', current: avgStudents, diff: 5 },
            { label: 'Completion Rate', current: `${completionRate}%`, diff: 3 },
            { label: 'Utilization', current: `${utilization}%`, diff: 7 },
        ];
    }

    private buildTopClasses(classes: any[]): any[] {
        return classes.slice(0, 5).map((cls, index) => ({
            name: cls.name || `Class ${index + 1}`,
            teacher: cls.teacher?.name || 'Unknown Teacher',
            students: Math.floor(Math.random() * 25) + 10,
            satisfaction: `${Math.floor(85 + Math.random() * 15)}%`
        }));
    }

    private updateCharts(classes: any[]): void {
        this.updateClassSizeChart(classes);
        this.updateSubjectsChart(classes);
        this.updateTrendChart(classes);
        this.updateTimeSlotChart(classes);
    }

    private updateClassSizeChart(classes: any[]): void {
        const sizeGroups = { 'Small (1-10)': 0, 'Medium (11-20)': 0, 'Large (21-30)': 0, 'Extra Large (30+)': 0 };

        classes.forEach(cls => {
            const size = Math.floor(Math.random() * 35) + 5;
            if (size <= 10) sizeGroups['Small (1-10)']++;
            else if (size <= 20) sizeGroups['Medium (11-20)']++;
            else if (size <= 30) sizeGroups['Large (21-30)']++;
            else sizeGroups['Extra Large (30+)']++;
        });

        this.pieDataClassSize = {
            labels: Object.keys(sizeGroups),
            datasets: [{ data: Object.values(sizeGroups), backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'] }]
        };
    }

    private updateSubjectsChart(classes: any[]): void {
        const subjectCounts: {[key: string]: number} = {};

        classes.forEach(cls => {
            const subjects = ['English', 'Spanish', 'French', 'German', 'Italian', 'Other'];
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            subjectCounts[randomSubject] = (subjectCounts[randomSubject] || 0) + 1;
        });

        const labels = Object.keys(subjectCounts);
        const data = Object.values(subjectCounts);

        this.doughnutDataSubjects = {
            labels: labels.length > 0 ? labels : ['English', 'Spanish', 'French', 'German', 'Italian', 'Other'],
            datasets: [{ data: data.length > 0 ? data : [25, 15, 10, 8, 5, 5], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#607D8B'] }]
        };
    }

    private updateTrendChart(classes: any[]): void {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const satisfactionData = months.map(() => Math.floor(85 + Math.random() * 15));
        const attendanceData = months.map(() => Math.floor(80 + Math.random() * 15));

        this.lineChartData = {
            labels: months,
            datasets: [
                { label: 'Student Satisfaction', data: satisfactionData, borderColor: '#42A5F5', tension: 0.4 },
                { label: 'Class Attendance', data: attendanceData, borderColor: '#66BB6A', tension: 0.4 }
            ]
        };
    }

    private updateTimeSlotChart(classes: any[]): void {
        const timeSlotData = [Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 15) + 5, Math.floor(Math.random() * 10) + 2];

        this.barChartData = {
            labels: ['Morning', 'Afternoon', 'Evening', 'Weekend'],
            datasets: [{ label: 'Number of Classes', backgroundColor: '#42A5F5', data: timeSlotData }]
        };
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Class size distribution pie chart
        this.pieDataClassSize = {
            labels: ['Small (1-10)', 'Medium (11-20)', 'Large (21-30)', 'Extra Large (30+)'],
            datasets: [
                {
                    data: [15, 20, 10, 3],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ],
                },
            ],
        };

        this.pieClassSizeOptions = {
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
                    text: 'Class Size Distribution',
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
                    data: [25, 15, 10, 8, 5, 5],
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
                    text: 'Classes by Subject',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Class satisfaction trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Student Satisfaction',
                    data: [85, 86, 84, 87, 88, 90, 91, 92, 93, 92, 94, 95],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Class Attendance',
                    data: [80, 82, 81, 83, 84, 86, 87, 88, 90, 89, 91, 92],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--green-500')
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
                    text: 'Class Performance Trends',
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
                    },
                    min: 50,
                    max: 100
                }
            }
        };

        // Classes by time slot bar chart
        this.barChartData = {
            labels: ['Morning', 'Afternoon', 'Evening', 'Weekend'],
            datasets: [
                {
                    label: 'Number of Classes',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [18, 15, 10, 5]
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
                    text: 'Classes by Time Slot',
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
