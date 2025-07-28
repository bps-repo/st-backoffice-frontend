import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from "primeng/ripple";
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

interface Report {
    id: string;
    name: string;
    type: string;
    generatedDate: string;
    generatedBy: string;
    status: string;
    description?: string;
    parameters?: { name: string; value: string }[];
    data?: any;
}

@Component({
    selector: 'app-student-report',
    templateUrl: './student-reports.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule,
        ChartModule,
        CardModule
    ]
})
export class StudentReports implements OnInit {
    reportId: string = '';
    report: Report | null = null;
    loading: boolean = true;

    // KPI data
    studentKpis = [
        { label: 'Total de Alunos', current: 850, diff: 5 },
        { label: 'Frequência Média', current: '78%', diff: 3 },
        { label: 'Novos Alunos', current: 95, diff: 12 },
        { label: 'Taxa de Retenção', current: '85%', diff: -2 },
    ];

    // Chart data and options
    attendanceByMonthData: any;
    attendanceByMonthOptions: any;

    studentsByStateData: any;
    studentsByStateOptions: any;

    studentsByLevelData: any;
    studentsByLevelOptions: any;

    // general data - in a real app, this would come from a service
    reports: Report[] = [
        {
            id: '1',
            name: 'Student Performance Report',
            type: 'Performance',
            generatedDate: '2023-01-15',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the performance of students across different levels.',
            parameters: [
                { name: 'Start Date', value: '2023-01-01' },
                { name: 'End Date', value: '2023-01-15' },
                { name: 'Course', value: 'All' }
            ],
            data: {
                labels: ['English', 'Math', 'Science', 'History'],
                datasets: [
                    {
                        label: 'Average Score',
                        data: [75, 82, 68, 90]
                    }
                ]
            }
        },
        {
            id: '2',
            name: 'Class Attendance Report',
            type: 'Attendance',
            generatedDate: '2023-02-20',
            generatedBy: 'Admin User',
            status: 'Generated',
            description: 'This report shows the attendance of students in different lessons.',
            parameters: [
                { name: 'Start Date', value: '2023-02-01' },
                { name: 'End Date', value: '2023-02-20' },
                { name: 'Class', value: 'All' }
            ],
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Attendance Rate',
                        data: [95, 88, 92, 90]
                    }
                ]
            }
        },
        {
            id: '3',
            name: 'Financial Summary Report',
            type: 'Financial',
            generatedDate: '2023-03-10',
            generatedBy: 'Admin User',
            status: 'Pending',
            description: 'This report shows the financial summary of the school.',
            parameters: [
                { name: 'Start Date', value: '2023-03-01' },
                { name: 'End Date', value: '2023-03-10' },
                { name: 'Department', value: 'All' }
            ]
        }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.reportId = params['id'];
            this.loadReport();
        });
        this.initChartData();
    }

    loadReport(): void {
        // Simulate API call
        setTimeout(() => {
            this.report = this.reports.find(r => r.id === this.reportId) || null;
            this.loading = false;
        }, 500);
    }

    initChartData(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Attendance by Month (Column Chart)
        this.attendanceByMonthData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Frequência (%)',
                    data: [75, 78, 80, 82, 79, 76, 74, 77, 81, 83, 85, 82],
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500')
                }
            ]
        };

        this.attendanceByMonthOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Frequência por Mês',
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

        // Students by State (Pie Chart)
        this.studentsByStateData = {
            labels: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Outros'],
            datasets: [
                {
                    data: [35, 25, 15, 10, 15],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--orange-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--orange-400')
                    ]
                }
            ]
        };

        this.studentsByStateOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 500 },
                        padding: 20
                    },
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Alunos por Estados',
                    font: { size: 16, weight: 'bold' },
                    color: textColor
                }
            }
        };

        // Students by Level (Bar Chart)
        this.studentsByLevelData = {
            labels: ['Iniciante', 'Básico', 'Intermediário', 'Avançado'],
            datasets: [
                {
                    label: 'Número de Alunos',
                    data: [220, 280, 190, 160],
                    backgroundColor: documentStyle.getPropertyValue('--primary-500')
                }
            ]
        };

        this.studentsByLevelOptions = {
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                title: {
                    display: true,
                    text: 'Alunos por Nível',
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

    downloadReport(): void {
        // In a real app, this would trigger a download of the report
        console.log('Downloading report:', this.report);
        alert('Report download started');
    }

    regenerateReport(): void {
        // In a real app, this would regenerate the report with the same parameters
        console.log('Regenerating report:', this.report);
        alert('Report regeneration started');
    }
}
