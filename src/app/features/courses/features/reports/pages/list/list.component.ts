// list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

interface ReportType {
    name: string;
    code: string;
}

@Component({
    selector: 'app-reports-list',
    templateUrl: './list.component.html',
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
        InputTextModule
    ]
})
export class ListComponent implements OnInit {
    reportTypes: ReportType[] = [
        { name: 'Progresso dos Alunos', code: 'student-progress' },
        { name: 'Desempenho por Unidade', code: 'unit-performance' },
        { name: 'Desempenho por Nível', code: 'level-performance' },
        { name: 'Estatísticas de Curso', code: 'course-stats' }
    ];

    selectedReportType: ReportType | null = null;
    dateRange: Date[] | undefined;
    reportData: any;
    reportOptions: any;
    reportGenerated: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    generateReport(): void {
        if (!this.selectedReportType) {
            alert('Por favor, selecione um tipo de relatório');
            return;
        }

        // In a real application, this would call a service to get the report data
        this.reportGenerated = true;
        this.initReportData();
    }

    initReportData(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        if (this.selectedReportType?.code === 'student-progress') {
            this.reportData = {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [
                    {
                        data: [65, 25, 10],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--gray-300'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--gray-200'),
                        ]
                    }
                ]
            };

            this.reportOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            font: { weight: 700 },
                            padding: 20,
                        },
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Student Progress Report',
                        font: {
                            size: 16
                        }
                    }
                },
                cutout: '60%'
            };
        } else if (this.selectedReportType?.code === 'unit-performance') {
            this.reportData = {
                labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
                datasets: [
                    {
                        label: 'Average Score',
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        data: [85, 72, 78, 90, 82]
                    }
                ]
            };

            this.reportOptions = {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                    title: {
                        display: true,
                        text: 'Unit Performance Report',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: documentStyle.getPropertyValue('--surface-border') }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: documentStyle.getPropertyValue('--surface-border') }
                    }
                }
            };
        } else if (this.selectedReportType?.code === 'level-performance') {
            this.reportData = {
                labels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
                datasets: [
                    {
                        data: [30, 40, 20, 10],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--primary-800'),
                            documentStyle.getPropertyValue('--primary-600'),
                            documentStyle.getPropertyValue('--primary-400'),
                            documentStyle.getPropertyValue('--primary-200'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--primary-700'),
                            documentStyle.getPropertyValue('--primary-500'),
                            documentStyle.getPropertyValue('--primary-300'),
                            documentStyle.getPropertyValue('--primary-100'),
                        ]
                    }
                ]
            };

            this.reportOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            font: { weight: 700 },
                            padding: 20,
                        },
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Level Performance Report',
                        font: {
                            size: 16
                        }
                    }
                }
            };
        } else if (this.selectedReportType?.code === 'course-stats') {
            this.reportData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Enrollments',
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        data: [65, 59, 80, 81, 56, 55]
                    },
                    {
                        label: 'Completions',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        data: [28, 48, 40, 19, 86, 27]
                    }
                ]
            };

            this.reportOptions = {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                        },
                    },
                    title: {
                        display: true,
                        text: 'Course Statistics Report',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: documentStyle.getPropertyValue('--surface-border') }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: documentStyle.getPropertyValue('--surface-border') }
                    }
                }
            };
        }
    }

    exportReport(): void {
        // In a real application, this would export the report to a file
        alert('Relatório exportado com sucesso!');
    }

    printReport(): void {
        // In a real application, this would print the report
        alert('Relatório enviado para impressão!');
    }
}
