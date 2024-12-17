import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

interface alert {
    label: string;
    description: string;
}
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    pieDataLevels: any;

    pieLevelOptions: any;

    alerts: alert[] = [
        {
            label: 'Inscrição',
            description: 'Username foi inscrito no curso de Beginning',
        },
        {
            label: 'Agendamento de aulas',
            description: 'Usernamer8374 acabou de agendar uma aula para as 12h ',
        },
        {
            label: 'Matricula',
            description: '15 novos estudantes matriculados pela user2',
        },
    ];

    constructor() {}

    ngOnInit(): void {
        this.initCharts();
    }

    async initCharts() {
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
            animation: {
                duration: 5,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28,
                    },
                    position: 'bottom',
                },
            },
        };
    }
}
