import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

interface alert {
    label: string;
    description: string;
}

@Component({
    selector: 'app-create',
    imports: [ChartModule, CommonModule],
    templateUrl: './evaluate.component.html'
})
export class EvaluateComponent implements OnInit{

    pieDataLevels: any;

    pieLevelOptions: any;

    alerts: alert[] = [
        {
            label: 'Avaliação de Janeiro',
            description: 'O aluno foi bem nas provas e teve 15v',
        },
        {
            label: 'Avaliação de Abril',
            description: 'O aluno foi mal nas provas e teve 5v',
        },
        {
            label: 'Avaliação de Agosto',
            description: 'O aluno faltou na prova',
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
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
                'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ],
            datasets: [
                {
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
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


    }

}
