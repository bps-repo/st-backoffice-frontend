import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { KpiIndicatorsComponent, Kpi } from 'src/app/shared/kpi-indicator/kpi-indicator.component';
import { PieChartComponent } from 'src/app/shared/components/charts/pie-chart/pie-chart.component';

@Component({
    selector: 'app-calendar-reports',
    standalone: true,
    imports: [
        ChartModule,
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        TableModule,
        KpiIndicatorsComponent,
    ],
    templateUrl: './calendar-reports.component.html',
})
export class CalendarReportsComponent implements OnInit {
    // KPI metrics
    totalLessons: number = 0;
    utilizationRate: number = 0;
    activeTeachers: number = 0;
    classHoursPerWeek: number = 0;

    // KPI objects for display
    kpis: Kpi[] = [];

    // Chart data
    lessonTypeData: any;
    lessonStatusData: any;
    dayDistributionData: any;
    dayDistributionOptions: any;
    teacherLessonsData: any;
    teacherLessonsOptions: any;

    // Sample teacher data
    teachers = [
        { name: 'John Smith', totalLessons: 45, activeLessons: 40, canceledLessons: 5 },
        { name: 'Maria Garcia', totalLessons: 38, activeLessons: 35, canceledLessons: 3 },
        { name: 'David Lee', totalLessons: 42, activeLessons: 38, canceledLessons: 4 },
        { name: 'Sarah Johnson', totalLessons: 36, activeLessons: 32, canceledLessons: 4 },
        { name: 'Michael Brown', totalLessons: 40, activeLessons: 37, canceledLessons: 3 },
    ];

    constructor() {}

    ngOnInit(): void {
        // Initialize KPIs with sample data
        this.totalLessons = 245;
        this.utilizationRate = 78;
        this.activeTeachers = 12;
        this.classHoursPerWeek = 120;

        this.initializeKpis();
        this.initCharts();
    }

    /**
     * Initialize KPI objects for display
     */
    initializeKpis(): void {
        this.kpis = [
            {
                label: 'Total de aulas',
                value: this.totalLessons,
                icon: { label: 'calendar', color: 'text-blue-500' }
            },
            {
                label: 'Taxa de aproveitamento',
                value: this.utilizationRate,
                icon: { label: 'user-check', color: 'text-green-500' }
            },
            {
                label: 'Professores activos',
                value: this.activeTeachers,
                icon: { label: 'user', color: 'text-purple-500' }
            },
            {
                label: 'Hora de aula/semana',
                value: this.classHoursPerWeek,
                icon: { label: 'clock', color: 'text-cyan-500' }
            }
        ];
    }

    /**
     * Initialize chart data
     */
    initCharts(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Lesson type distribution pie chart data
        this.lessonTypeData = {
            labels: ['Online', 'Presencial'],
            datasets: [
                {
                    data: [95, 150],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--purple-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--cyan-400'),
                        documentStyle.getPropertyValue('--purple-400')
                    ]
                }
            ]
        };

        // Lesson status pie chart data
        this.lessonStatusData = {
            labels: ['Activas', 'Canceladas'],
            datasets: [
                {
                    data: [220, 25],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--red-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--red-400')
                    ]
                }
            ]
        };

        // Day distribution bar chart data
        this.dayDistributionData = {
            labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Centro A',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [25, 30, 35, 28, 32, 15, 5]
                },
                {
                    type: 'bar',
                    label: 'Centro B',
                    backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                    data: [20, 25, 30, 22, 28, 12, 3]
                },
                {
                    type: 'bar',
                    label: 'Centro C',
                    backgroundColor: documentStyle.getPropertyValue('--teal-500'),
                    data: [15, 20, 25, 18, 22, 10, 2]
                }
            ]
        };

        this.dayDistributionOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Distribuição por dia de semana e centro',
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

        // Teacher lessons bar chart data
        this.teacherLessonsData = {
            labels: this.teachers.map(teacher => teacher.name),
            datasets: [
                {
                    type: 'bar',
                    label: 'Aulas Activas',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    data: this.teachers.map(teacher => teacher.activeLessons)
                },
                {
                    type: 'bar',
                    label: 'Aulas Canceladas',
                    backgroundColor: documentStyle.getPropertyValue('--red-500'),
                    data: this.teachers.map(teacher => teacher.canceledLessons)
                }
            ]
        };

        this.teacherLessonsOptions = {
            indexAxis: 'y',
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por professor',
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
                    }
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
}
