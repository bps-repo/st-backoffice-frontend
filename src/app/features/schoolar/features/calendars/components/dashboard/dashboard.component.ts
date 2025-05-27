import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-calendars-dashboard',
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
export class CalendarsDashboardComponent implements OnInit {

    pieDataScheduleType: any;
    pieScheduleTypeOptions: any;

    lineChartData: any;
    lineChartOptions: any;

    barChartData: any;
    barChartOptions: any;

    heatmapData: any;
    heatmapOptions: any;

    dateRange: Date[] | undefined;

    kpis = [
        { label: 'Total Schedules', current: 245, diff: 12 },
        { label: 'Utilization Rate', current: '78%', diff: 5 },
        { label: 'Cancellation Rate', current: '4%', diff: -2 },
        { label: 'Rescheduled', current: 18, diff: -8 },
    ];

    upcomingSchedules = [
        { title: 'Advanced English', teacher: 'John Smith', date: '2025-06-01', time: '09:00 - 10:30', room: 'Room 101' },
        { title: 'Intermediate Spanish', teacher: 'Maria Garcia', date: '2025-06-01', time: '11:00 - 12:30', room: 'Room 102' },
        { title: 'Beginner French', teacher: 'David Lee', date: '2025-06-02', time: '14:00 - 15:30', room: 'Room 103' },
        { title: 'Business English', teacher: 'Sarah Johnson', date: '2025-06-03', time: '10:00 - 11:30', room: 'Room 104' },
        { title: 'Conversation Practice', teacher: 'Michael Brown', date: '2025-06-04', time: '16:00 - 17:30', room: 'Room 105' },
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

        // Schedule type distribution pie chart
        this.pieDataScheduleType = {
            labels: ['Regular Classes', 'One-on-One', 'Workshops', 'Exams', 'Other'],
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

        this.pieScheduleTypeOptions = {
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
                    text: 'Schedule Type Distribution',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Schedule trend line chart
        this.lineChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Scheduled',
                    data: [65, 59, 80, 81, 56, 55, 40, 55, 72, 78, 95, 120],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Completed',
                    data: [62, 57, 78, 78, 53, 52, 38, 52, 68, 74, 90, 115],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--green-500')
                },
                {
                    label: 'Cancelled',
                    data: [3, 2, 2, 3, 3, 3, 2, 3, 4, 4, 5, 5],
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
                    text: 'Schedule Trends',
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

        // Schedules by day of week bar chart
        this.barChartData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
                {
                    label: 'Number of Schedules',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [48, 52, 45, 50, 40, 10, 0]
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
                    text: 'Schedules by Day of Week',
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

        // Time slot heatmap (using bar chart as a heatmap)
        this.heatmapData = {
            labels: ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20'],
            datasets: [
                {
                    label: 'Monday',
                    backgroundColor: documentStyle.getPropertyValue('--blue-300'),
                    data: [80, 90, 60, 85, 75, 50]
                },
                {
                    label: 'Tuesday',
                    backgroundColor: documentStyle.getPropertyValue('--blue-400'),
                    data: [85, 95, 65, 90, 80, 55]
                },
                {
                    label: 'Wednesday',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [75, 85, 55, 80, 70, 45]
                },
                {
                    label: 'Thursday',
                    backgroundColor: documentStyle.getPropertyValue('--blue-600'),
                    data: [82, 92, 62, 87, 77, 52]
                },
                {
                    label: 'Friday',
                    backgroundColor: documentStyle.getPropertyValue('--blue-700'),
                    data: [70, 80, 50, 75, 65, 40]
                }
            ]
        };

        this.heatmapOptions = {
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Time Slot Utilization (%)',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    stacked: true,
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
