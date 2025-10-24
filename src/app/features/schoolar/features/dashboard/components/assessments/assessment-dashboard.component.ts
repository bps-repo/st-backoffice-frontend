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
import { AssessmentService } from 'src/app/core/services/assessment.service';

@Component({
    selector: 'app-assessments',
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
    templateUrl: './assessment-dashboard.component.html',
})
export class AssessmentsDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Data observables
    assessments$!: Observable<any[]>;
    kpis$!: Observable<any[]>;
    topAssessments$!: Observable<any[]>;

    // Chart data
    pieDataAssessmentType: any;
    pieAssessmentTypeOptions: any;
    lineChartData: any;
    lineChartOptions: any;
    barChartData: any;
    barChartOptions: any;

    // UI data
    dateRange: Date[] | undefined;
    loading = true;

    constructor(private assessmentService: AssessmentService) {}

    ngOnInit(): void {
        this.loadData();
        this.initCharts();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadData(): void {
        this.assessments$ = this.assessmentService.getAssessments();

        this.kpis$ = this.assessments$.pipe(
            map(assessments => this.buildKPIs(assessments))
        );

        this.topAssessments$ = this.assessments$.pipe(
            map(assessments => this.buildTopAssessments(assessments))
        );

        this.assessments$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(assessments => {
            this.updateCharts(assessments);
            this.loading = false;
        });
    }

    private buildKPIs(assessments: any[]): any[] {
        const totalAssessments = assessments.length;
        const avgScore = Math.floor(75 + Math.random() * 20);
        const completionRate = Math.floor(85 + Math.random() * 15);
        const passRate = Math.floor(80 + Math.random() * 15);

        return [
            { label: 'Total Assessments', current: totalAssessments, diff: 15 },
            { label: 'Avg. Score', current: `${avgScore}%`, diff: 3 },
            { label: 'Completion Rate', current: `${completionRate}%`, diff: 5 },
            { label: 'Pass Rate', current: `${passRate}%`, diff: 2 },
        ];
    }

    private buildTopAssessments(assessments: any[]): any[] {
        return assessments.slice(0, 5).map((assessment, index) => ({
            title: assessment.title || `Assessment ${index + 1}`,
            students: Math.floor(Math.random() * 100) + 50,
            avgScore: `${Math.floor(75 + Math.random() * 20)}%`,
            passRate: `${Math.floor(80 + Math.random() * 15)}%`
        }));
    }

    private updateCharts(assessments: any[]): void {
        this.updateAssessmentTypeChart(assessments);
        this.updateTrendChart(assessments);
        this.updateScoreDistributionChart(assessments);
    }

    private updateAssessmentTypeChart(assessments: any[]): void {
        const typeCounts: {[key: string]: number} = {};

        assessments.forEach(assessment => {
            const type = assessment.type || 'Quiz';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const labels = Object.keys(typeCounts);
        const data = Object.values(typeCounts);

        if (labels.length === 0) {
            this.pieDataAssessmentType = {
                labels: ['Quiz', 'Test', 'Exam', 'Project', 'Presentation', 'Other'],
                datasets: [{ data: [35, 25, 20, 10, 5, 5], backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#EC407A'] }]
            };
        } else {
            this.pieDataAssessmentType = {
                labels: labels,
                datasets: [{ data: data, backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#EC407A'] }]
            };
        }
    }

    private updateTrendChart(assessments: any[]): void {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const avgScoreData = months.map(() => Math.floor(75 + Math.random() * 20));
        const passRateData = months.map(() => Math.floor(80 + Math.random() * 15));

        this.lineChartData = {
            labels: months,
            datasets: [
                { label: 'Average Score', data: avgScoreData, borderColor: '#42A5F5', tension: 0.4 },
                { label: 'Pass Rate', data: passRateData, borderColor: '#66BB6A', tension: 0.4 }
            ]
        };
    }

    private updateScoreDistributionChart(assessments: any[]): void {
        const scoreData = [50, 100, 250, 400, 300, 150];
        this.barChartData = {
            labels: ['0-50%', '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'],
            datasets: [{ label: 'Number of Students', backgroundColor: '#42A5F5', data: scoreData }]
        };
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Assessment type distribution pie chart
        this.pieDataAssessmentType = {
            labels: ['Quiz', 'Test', 'Exam', 'Project', 'Presentation', 'Other'],
            datasets: [
                {
                    data: [35, 25, 20, 10, 5, 5],
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

        this.pieAssessmentTypeOptions = {
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
                    text: 'Assessment Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Assessment scores trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Average Score',
                    data: [75, 76, 74, 77, 78, 80, 79, 81, 82, 83, 84, 85],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Pass Rate',
                    data: [82, 83, 81, 84, 85, 87, 86, 88, 89, 90, 91, 92],
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
                    text: 'Assessment Performance Trends',
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

        // Assessment score distribution bar chart
        this.barChartData = {
            labels: ['0-50%', '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'],
            datasets: [
                {
                    label: 'Number of Students',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [50, 100, 250, 400, 300, 150]
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
                    text: 'Assessment Score Distribution',
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
