import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-materials-dashboard',
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
export class MaterialsDashboardComponent implements OnInit {

    pieDataMaterialType: any;
    pieMaterialTypeOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Materials', current: 950, diff: 10 },
        { label: 'Downloads', current: 3250, diff: 15 },
        { label: 'Avg. Rating', current: '4.2/5', diff: 3 },
        { label: 'New Uploads', current: 45, diff: 8 },
    ];

    topMaterials = [
        { title: 'Advanced English Grammar Guide', type: 'PDF', downloads: 520, rating: '4.8/5' },
        { title: 'Spanish Vocabulary Flashcards', type: 'Interactive', downloads: 480, rating: '4.7/5' },
        { title: 'French Pronunciation Audio Files', type: 'Audio', downloads: 420, rating: '4.6/5' },
        { title: 'Business English Presentation Templates', type: 'Slides', downloads: 380, rating: '4.5/5' },
        { title: 'German Basics Workbook', type: 'PDF', downloads: 350, rating: '4.4/5' },
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

        // Material type distribution pie chart
        this.pieDataMaterialType = {
            labels: ['PDF', 'Video', 'Audio', 'Interactive', 'Slides', 'Other'],
            datasets: [
                {
                    data: [40, 20, 15, 10, 10, 5],
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

        this.pieMaterialTypeOptions = {
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
                    text: 'Material Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Material downloads trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Downloads',
                    data: [250, 280, 300, 320, 340, 360, 380, 400, 420, 450, 480, 520],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Uploads',
                    data: [30, 35, 32, 38, 40, 42, 39, 45, 48, 50, 55, 60],
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
                    text: 'Material Usage Trends',
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

        // Material ratings bar chart
        this.barChartData = {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
                {
                    label: 'Number of Materials',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [10, 30, 120, 450, 340]
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
                    text: 'Material Ratings Distribution',
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
