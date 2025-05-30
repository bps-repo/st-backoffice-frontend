import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-students-dashboard',
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
export class StudentsDashboardComponent implements OnInit {

    pieDataGender: any;
    pieGenderOptions: any;

    pieDataAge: any;
    pieAgeOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Students', current: 750, diff: 8 },
        { label: 'New Enrollments', current: 120, diff: 15 },
        { label: 'Active Students', current: 680, diff: 5 },
        { label: 'Completion Rate', current: '85%', diff: 3 },
    ];

    topPerformers = [
        { name: 'John Smith', level: 'Advanced', attendance: '95%', grade: 'A' },
        { name: 'Maria Garcia', level: 'Intermediate', attendance: '92%', grade: 'A-' },
        { name: 'David Lee', level: 'Advanced', attendance: '90%', grade: 'B+' },
        { name: 'Sarah Johnson', level: 'Elementary', attendance: '88%', grade: 'B' },
        { name: 'Michael Brown', level: 'Beginner', attendance: '85%', grade: 'B-' },
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
}
