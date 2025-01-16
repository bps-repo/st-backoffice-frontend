import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PieChartComponent } from 'src/app/shared/components/pie-chart/pie-chart.component';

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [
        InputTextModule,
        CommonModule,
        ChartModule,
        PieChartComponent,
        BadgeModule,
        PanelModule,
    ],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
    user_personal_info: any[] = [];
    notifications: any[] = [];
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

        this.notifications = [
            {
                title: 'Aviso 1',
                message: 'Terminou o quiz n#03-adjectives...',
                icon: 'pi pi-wallet',
            },
            {
                title: 'Aviso 2',
                message: 'Acabou de agendar uma aula para as 12h',
                icon: 'pi pi-bell',
            },
            {
                title: 'Aviso 3',
                message: 'Fez abertura de um inquerito para as 12h',
                icon: 'pi pi-file-pdf',
            },
            {
                title: 'Aviso 4',
                message: 'Pagamento do certificado Beginner',
                icon: 'pi pi-money-bill',
            },
        ];
    }
}
