import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-lessons-dashboard',
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
    templateUrl: './lessons-dashboard.component.html',
})
export class LessonsDashboardComponent implements OnInit {

    pieDataLessonType: any;
    pieLessonTypeOptions: any;

    doughnutDataSubjects: any;
    doughnutSubjectsOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Lessons', current: 1250, diff: 15 },
        { label: 'Completion Rate', current: '94%', diff: 3 },
        { label: 'Avg. Attendance', current: '88%', diff: 2 },
        { label: 'Avg. Duration', current: '75 min', diff: 5 },
    ];

    topLessons = [
        { title: 'Advanced English Grammar', teacher: 'John Smith', students: 22, rating: '4.9/5' },
        { title: 'Spanish Conversation', teacher: 'Maria Garcia', students: 18, rating: '4.8/5' },
        { title: 'French Pronunciation', teacher: 'David Lee', students: 15, rating: '4.7/5' },
        { title: 'Business English Vocabulary', teacher: 'Sarah Johnson', students: 12, rating: '4.6/5' },
        { title: 'German Basics', teacher: 'Michael Brown', students: 10, rating: '4.5/5' },
    ];

    constructor() {}

    ngOnInit(): void {
        this.initCharts();
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
