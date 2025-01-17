import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexResponsive,
    ApexXAxis,
    ApexLegend,
    ApexFill,
} from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NOTIFICATIONS } from 'src/app/shared/constants/notifications';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    xaxis: ApexXAxis;
    legend: ApexLegend;
    fill: ApexFill;
};

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [
        InputTextModule,
        CommonModule,
        ChartModule,
        BadgeModule,
        PanelModule,
        NgApexchartsModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
    @ViewChild('chart') chart?: ChartComponent;
    public chartOptions: ChartOptions;

    user_personal_info: any[] = [];

    notifications: any[] = NOTIFICATIONS;

    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: 'Speaking',
                    data: [44, 55, 41, 67, 22, 43],
                    color: '#4338ca',
                },
                {
                    name: 'Talking',
                    data: [13, 23, 20, 8, 13, 27],
                    color: '#0e0457',
                },
                {
                    name: 'Writing',
                    data: [11, 17, 15, 15, 21, 14],
                    color: '#136c34',
                },
                {
                    name: 'Listening',
                    data: [21, 7, 25, 13, 22, 8],
                    color: '#5e1d3d',
                },
            ],
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: true,
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                type: 'category',
                categories: [
                    '01/2025',
                    '02/2025',
                    '03/2025',
                    '04/2025',
                    '05/2025',
                    '06/2025',
                ],
            },
            legend: {
                position: 'right',
                offsetY: 40,
            },
            fill: {
                opacity: 1,
            },
        };
    }

    ngOnInit(): void {
        this.user_personal_info = [
            {
                title: 'Nº Utente',
                value: '1000',
            },
            {
                title: 'Tipo de Inscrição',
                value: '4 Adults - Intermediate 1',
            },
            {
                title: 'Nº de Identificação',
                value: '0097529349LA083',
            },
            {
                title: 'Data de Nascimento',
                value: '12-04-2015',
            },
            {
                title: 'Telefone',
                value: '933449392',
            },
            {
                title: 'Nacionalidade',
                value: 'Angolana',
            },
            {
                title: 'Data de Nascimento',
                value: '12-04-2015',
            },
            {
                title: 'Género',
                value: 'Masculino',
            },
        ];
    }
}
