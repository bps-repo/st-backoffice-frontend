import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LessonService } from '../../../../../../core/services/lesson.service';
import { StudentService } from '../../../../../../core/services/student.service';
import { LessonStatus } from '../../../../../../core/enums/lesson-status';

@Component({
    selector: 'app-lesson-reports',
    templateUrl: './lesson-reports.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        DropdownModule,
        CalendarModule,
        ChartModule,
        RippleModule,
        CardModule,
        InputTextModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class LessonReports implements OnInit {
    dateRange: Date[] | undefined;
    reportGenerated: boolean = true; // Set to true to show report by default

    // KPI data
    kpis = [
        { label: 'Total de aulas', value: 1250, icon: 'pi-book', color: 'bg-blue-100' },
        { label: 'Total de alunos', value: 3450, icon: 'pi-users', color: 'bg-green-100' },
        { label: 'Materias utilizados', value: 85, icon: 'pi-file-pdf', color: 'bg-orange-100' },
        { label: 'Taxa de presença', value: '92%', icon: 'pi-check-circle', color: 'bg-purple-100' }
    ];

    // Chart data
    pieDataLessonType: any;
    pieLessonTypeOptions: any;

    barChartLessonStatus: any;
    barChartLessonStatusOptions: any;

    pieChartLevels: any;
    pieChartLevelsOptions: any;

    lineChartParticipation: any;
    lineChartParticipationOptions: any;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private lessonApiService: LessonService,
        private studentService: StudentService
    ) {}

    ngOnInit(): void {
        this.initCharts();
        // In a real implementation, we would fetch data from the services
        // this.fetchData();
    }

    fetchData(): void {
        // In a real implementation, this would fetch data from the services
        // Example:
        // this.lessonApiService.getLessons().subscribe(lessons => {
        //     // Process lessons data for charts and KPIs
        //     this.updateKPIs(lessons);
        //     this.updateCharts(lessons);
        // });
    }

    filterData(): void {
        if (this.dateRange && this.dateRange.length === 2) {
            // In a real implementation, this would filter data based on date range
            // Example:
            // const startDate = this.dateRange[0].toISOString().split('T')[0];
            // const endDate = this.dateRange[1].toISOString().split('T')[0];
            // this.lessonApiService.getLessonsByDateRange(startDate, endDate).subscribe(lessons => {
            //     // Process filtered lessons data
            //     this.updateKPIs(lessons);
            //     this.updateCharts(lessons);
            // });

            this.messageService.add({
                severity: 'success',
                summary: 'Filtrado',
                detail: 'Relatório filtrado com sucesso!'
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, selecione um período válido'
            });
        }
    }

    initCharts(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Distribuição por tipo (Distribution by type) - Pie chart
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
                    text: 'Distribuição por tipo',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Aulas por status (Lessons by status) - Bar chart
        this.barChartLessonStatus = {
            labels: ['AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELLED', 'SCHEDULED', 'POSTPONED', 'OVERDUE'],
            datasets: [
                {
                    label: 'Número de aulas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [150, 250, 400, 80, 300, 120, 50]
                }
            ]
        };

        this.barChartLessonStatusOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Aulas por status',
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

        // Distribuição por níveis (Distribution by levels) - Pie chart
        this.pieChartLevels = {
            labels: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Proficient'],
            datasets: [
                {
                    data: [15, 25, 30, 20, 7, 3],
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

        this.pieChartLevelsOptions = {
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
                    text: 'Distribuição por níveis',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            },
        };

        // Tendência de participação (Participation trend) - Line chart
        this.lineChartParticipation = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Taxa de participação',
                    data: [85, 87, 90, 92, 88, 86, 84, 89, 91, 93, 94, 95],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    pointBackgroundColor: documentStyle.getPropertyValue('--blue-500')
                }
            ]
        };

        this.lineChartParticipationOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Tendência de participação',
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
                    min: 80,
                    max: 100
                }
            }
        };
    }

    exportReport(): void {
        // In a real application, this would export the report to a file
        this.messageService.add({
            severity: 'success',
            summary: 'Exportado',
            detail: 'Relatório exportado com sucesso!'
        });
    }

    printReport(): void {
        // In a real application, this would print the report
        this.messageService.add({
            severity: 'success',
            summary: 'Impressão',
            detail: 'Relatório enviado para impressão!'
        });
    }
}
