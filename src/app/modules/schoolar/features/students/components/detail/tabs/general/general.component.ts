import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-general',
    standalone: true,
    imports: [InputTextModule, CommonModule],
    templateUrl: './general.component.html',
    styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
    user_personal_info: any[] = [];
    ngOnInit(): void {
        this.user_personal_info = [
            {
                label: 'Nº Utente',
                value: '1000',
            },
            {
                label: 'Tipo de Inscrição',
                value: '4 Adults - Intermediate 1',
            },
            {
                label: 'Nº de Identificação',
                value: '0097529349LA083',
            },
            {
                label: 'Data de Nascimento',
                value: '12-04-2015',
            },
            {
                label: 'Telefone',
                value: '933449392',
            },
            {
                label: 'Nacionalidade',
                value: 'Angolana',
            },
            {
                label: 'Data de Nascimento',
                value: '12-04-2015',
            },
            {
                label: 'Género',
                value: 'Masculino',
            },
        ];
    }
}
