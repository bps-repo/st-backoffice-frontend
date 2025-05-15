import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';

interface Alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-dashboard-empresa',
    standalone: true,
    imports: [CommonModule, FormsModule, ChartModule, CalendarModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    kpis = [
        { label: 'Centros Ativos', current: 5, diff: 0 },
        { label: 'Contratos Ativos', current: 38, diff: 12 },
        { label: 'Funcionários', current: 124, diff: 8 },
        { label: 'Relatórios Emitidos', current: 47, diff: -2 },
    ];

    alerts: Alert[] = [
        { label: 'Novo Centro', description: 'Centro Zona Sul foi inaugurado' },
        { label: 'Contrato Renovado', description: 'Contrato da empresa X renovado por mais 12 meses' },
        { label: 'Novo Funcionário', description: 'João da Silva foi contratado como analista' },
    ];

    pieData: any;
    pieOptions: any;
    barChartData: any;
    barChartOptions: any;
    dateRange: Date[] | undefined;

    ngOnInit(): void {
        this.initPieChart();
        this.initBarChart();
    }

    initPieChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieData = {
            labels: ['Centro Norte', 'Centro Sul', 'Centro Leste', 'Centro Oeste'],
            datasets: [
                {
                    data: [35, 40, 25, 24],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-700'),
                        documentStyle.getPropertyValue('--primary-500'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-200'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                },
            ],
        };

        this.pieOptions = {
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
                    label: 'Novos Contratos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [4, 5, 6, 7, 5, 8],
                },
                {
                    label: 'Contratos Ativos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-300'),
                    data: [30, 32, 34, 35, 36, 38],
                },
            ],
        };

        this.barChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: textColor },
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
        console.log('Filtrando dados de empresa entre:', this.dateRange);
    }
}
