import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';

interface Alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule],
    templateUrl: './general-dashboard.component.html',
})
export class GeneralDashboardComponent implements OnInit {

    pieDataLevels: any;
    pieLevelOptions: any;
    barChartData: any;
    barChartOptions: any;
    dateRange: Date[] | undefined;

    alerts: Alert[] = [
        {label: 'Inscrição', description: 'Username foi inscrito no curso de Beginning'},
        {label: 'Agendamento de aulas', description: 'Usernamer8374 acabou de agendar uma aula para as 12h'},
        {label: 'Matrícula', description: '15 novos estudantes matriculados pela user2'},
    ];

    kpis = [
        {label: 'Inscrições (mês)', current: 250, diff: 12},
        {label: 'Aulas marcadas', current: 360, diff: 4},
        {label: 'Desistências', current: 45, diff: -5},
        {label: 'Novos professores', current: 6, diff: 20},
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.initCharts();
        this.initBarChart();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieDataLevels = {
            labels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
            datasets: [
                {
                    data: [400, 100, 150, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-800'),
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-200'),
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
                        font: {weight: 700},
                        padding: 28,
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
                    label: 'Inscrições',
                    backgroundColor: documentStyle.getPropertyValue('--primary-800'),
                    data: [150, 200, 180, 220, 240, 250],
                },
                {
                    label: 'Aulas Marcadas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-400'),
                    data: [300, 320, 310, 330, 350, 360],
                },
                {
                    label: 'Desistências',
                    backgroundColor: documentStyle.getPropertyValue('--red-400'),
                    data: [50, 12, 20, 10, 40, 13],
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
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
                y: {
                    beginAtZero: true,
                    ticks: {color: textColor},
                    grid: {color: documentStyle.getPropertyValue('--surface-border')},
                },
            },
        };
    }

    filtrarDados() {
        // Simule ou faça uma chamada para API aqui com base na data
        console.log('Filtrar por:', this.dateRange);
    }
}
