import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-certificates-students-materials-dashboard',
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
export class CertificatesDashboardComponent implements OnInit {

    pieDataCertificateType: any;
    pieCertificateTypeOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Certificates', current: 850, diff: 12 },
        { label: 'Issued This Month', current: 45, diff: 8 },
        { label: 'Completion Rate', current: '92%', diff: 3 },
        { label: 'Avg. Score', current: '85%', diff: 5 },
    ];

    recentCertificates = [
        { student: 'John Smith', course: 'Advanced English', issueDate: '2025-05-15', score: '95%' },
        { student: 'Maria Garcia', course: 'Intermediate Spanish', issueDate: '2025-05-14', score: '92%' },
        { student: 'David Lee', course: 'Business English', issueDate: '2025-05-12', score: '88%' },
        { student: 'Sarah Johnson', course: 'French Basics', issueDate: '2025-05-10', score: '90%' },
        { student: 'Michael Brown', course: 'German Intermediate', issueDate: '2025-05-08', score: '85%' },
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

        // Certificate type distribution pie chart
        this.pieDataCertificateType = {
            labels: ['Course Completion', 'Level Achievement', 'Exam Success', 'Special Recognition', 'Workshop Completion'],
            datasets: [
                {
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                    ],
                },
            ],
        };

        this.pieCertificateTypeOptions = {
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
                    text: 'Certificate Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Certificate issuance trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Certificates Issued',
                    data: [65, 59, 80, 81, 56, 55, 40, 55, 72, 78, 95, 120],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Average Score',
                    data: [75, 78, 76, 79, 80, 82, 81, 83, 84, 85, 86, 88],
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
                    text: 'Certificate Issuance Trends',
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

        // Certificates by course level bar chart
        this.barChartData = {
            labels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Proficient'],
            datasets: [
                {
                    label: 'Number of Certificates',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [150, 220, 280, 150, 50]
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
                    text: 'Certificates by Course Level',
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
