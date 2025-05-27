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

interface ReportType {
    name: string;
    code: string;
}

@Component({
    selector: 'app-list',
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
        InputTextModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class ListComponent implements OnInit {
    reportTypes: ReportType[] = [
        { name: 'Desempenho dos Alunos', code: 'student-performance' },
        { name: 'Frequência nas Aulas', code: 'class-attendance' },
        { name: 'Resumo Financeiro', code: 'financial-summary' },
        { name: 'Estatísticas Acadêmicas', code: 'academic-stats' }
    ];

    selectedReportType: ReportType | null = null;
    dateRange: Date[] | undefined;
    reportData: any;
    reportOptions: any;
    reportGenerated: boolean = false;

    constructor(private router: Router, private messageService: MessageService) {}

    ngOnInit(): void {
    }

    generateReport(): void {
        if (!this.selectedReportType) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, selecione um tipo de relatório'
            });
            return;
        }

        // In a real application, this would call a service to get the report data
        this.reportGenerated = true;
        this.initReportData();

        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Relatório gerado com sucesso!'
        });
    }

    initReportData(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        if (this.selectedReportType?.code === 'student-performance') {
            this.reportData = {
                labels: ['Excelente', 'Bom', 'Médio', 'Abaixo da Média'],
                datasets: [
                    {
                        data: [40, 30, 20, 10],
                        backgroundColor: [
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--red-500'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--yellow-400'),
                            documentStyle.getPropertyValue('--red-400'),
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
                        text: 'Relatório de Desempenho dos Alunos',
                        font: {
                            size: 16
                        }
                    }
                },
                cutout: '60%'
            };
        } else if (this.selectedReportType?.code === 'class-attendance') {
            this.reportData = {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [
                    {
                        label: 'Taxa de Presença',
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        data: [95, 88, 92, 90]
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
                        text: 'Relatório de Frequência nas Aulas',
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
        } else if (this.selectedReportType?.code === 'financial-summary') {
            this.reportData = {
                labels: ['Matrículas', 'Mensalidades', 'Material Didático', 'Atividades Extras'],
                datasets: [
                    {
                        data: [40, 35, 15, 10],
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
                        text: 'Resumo Financeiro',
                        font: {
                            size: 16
                        }
                    }
                }
            };
        } else if (this.selectedReportType?.code === 'academic-stats') {
            this.reportData = {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Novas Matrículas',
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        data: [65, 59, 80, 81, 56, 55]
                    },
                    {
                        label: 'Conclusões',
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
                        text: 'Estatísticas Acadêmicas',
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
