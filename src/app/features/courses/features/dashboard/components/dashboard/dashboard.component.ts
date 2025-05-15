import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

interface Alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    pieDataLevels: any;
    pieLevelOptions: any;
    barChartData: any;
    barChartOptions: any;
    dateRange: Date[] | undefined;

    alerts: Alert[] = [
        { label: 'Novo Curso', description: 'Curso de Design Gráfico foi adicionado' },
        { label: 'Atualização', description: 'Curso de Programação Avançada atualizado com novos módulos' },
        { label: 'Curso Removido', description: 'Curso de Fotografia Básica foi arquivado' },
    ];

    kpis = [
        { label: 'Cursos Ativos', current: 42, diff: 10 },
        { label: 'Novos Cursos', current: 8, diff: 25 },
        { label: 'Total de Unidades', current: 6, diff: 0 },
        { label: 'Alunos por Curso (média)', current: 120, diff: 5 },
    ];

    constructor() {}

    ngOnInit(): void {
        this.initPieChart();
        this.initBarChart();
    }

    initPieChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieDataLevels = {
            labels: ['Tecnologia', 'Idiomas', 'Negócios', 'Design', 'Marketing'],
            datasets: [
                {
                    data: [14, 10, 8, 6, 4],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-200'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                },
            ],
        };

        this.pieLevelOptions = {
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
            },
        };
    }

    initBarChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.barChartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Novos Cursos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [2, 3, 4, 6, 5, 8],
                },
                {
                    label: 'Cursos Ativos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    data: [30, 32, 35, 37, 39, 42],
                },
            ],
        };

        this.barChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') },
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: documentStyle.getPropertyValue('--surface-border') },
                },
            },
        };
    }

    filtrarDados() {
        console.log('Filtrando cursos entre:', this.dateRange);
    }
}
