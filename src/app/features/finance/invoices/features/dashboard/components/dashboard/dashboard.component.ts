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
    selector: 'app-students-materials-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    pieDataDocs: any;
    pieDocOptions: any;
    barChartData: any;
    barChartOptions: any;
    dateRange: Date[] | undefined;

    alerts: Alert[] = [
        { label: 'Nova Fatura Pro-Forma', description: 'Fatura no valor de 500€ emitida para cliente X' },
        { label: 'Recibo Emitido', description: 'Pagamento de 300€ confirmado' },
        { label: 'Relatório Financeiro', description: 'Relatório mensal de abril gerado' },
    ];

    kpis = [
        { label: 'Total Faturado (Mês)', current: 8500, diff: 15 },
        { label: 'Faturas Pro-Forma', current: 23, diff: 10 },
        { label: 'Recibos Emitidos', current: 18, diff: -5 },
        { label: 'Relatórios Gerados', current: 6, diff: 20 },
    ];

    constructor() {}

    ngOnInit(): void {
        this.initPieChart();
        this.initBarChart();
    }

    initPieChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieDataDocs = {
            labels: ['Faturas Pro-Forma', 'Recibos', 'Relatórios'],
            datasets: [
                {
                    data: [23, 18, 6],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-200'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                },
            ],
        };

        this.pieDocOptions = {
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
                    label: 'Faturado (€)',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [6000, 7200, 8100, 7500, 8200, 8500],
                },
                {
                    label: 'Recibos Emitidos',
                    backgroundColor: documentStyle.getPropertyValue('--primary-300'),
                    data: [15, 18, 20, 19, 17, 18],
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
        console.log('Filtrando faturação entre:', this.dateRange);
        // Aqui você pode aplicar filtro com base nas datas
    }
}
