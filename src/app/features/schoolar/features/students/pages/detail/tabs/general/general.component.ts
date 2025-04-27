import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { PieChartComponent } from 'src/app/shared/components/charts/pie-chart/pie-chart.component';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-general',
    imports: [
        InputTextModule,
        CommonModule,
        ChartModule,
        PieChartComponent,
        CardModule,
        AvatarModule,
        BadgeModule,
        DividerModule,
        TagModule,
        ButtonModule,
        RippleModule
    ],
    templateUrl: './general.component.html'
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
