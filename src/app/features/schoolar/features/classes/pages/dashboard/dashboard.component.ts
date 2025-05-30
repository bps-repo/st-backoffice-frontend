import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-classes-students-materials-dashboard',
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
    templateUrl: './dashboard.component.html',
})
export class ClassesDashboardComponent implements OnInit {

    pieDataClassSize: any;
    pieClassSizeOptions: any;

    doughnutDataSubjects: any;
    doughnutSubjectsOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Classes', current: 48, diff: 10 },
        { label: 'Average Students', current: 18, diff: 5 },
        { label: 'Completion Rate', current: '92%', diff: 3 },
        { label: 'Utilization', current: '85%', diff: 7 },
    ];

    topClasses = [
        { name: 'Advanced English', teacher: 'John Smith', students: 22, satisfaction: '95%' },
        { name: 'Intermediate Spanish', teacher: 'Maria Garcia', students: 18, satisfaction: '92%' },
        { name: 'Beginner French', teacher: 'David Lee', students: 15, satisfaction: '90%' },
        { name: 'Business English', teacher: 'Sarah Johnson', students: 12, satisfaction: '88%' },
        { name: 'Conversation Practice', teacher: 'Michael Brown', students: 10, satisfaction: '85%' },
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
