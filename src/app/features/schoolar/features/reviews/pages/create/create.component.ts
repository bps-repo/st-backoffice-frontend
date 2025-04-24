import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import {
    COUNTRIES,
    DISCOUNTS,
    ENTITIES,
    INSTALATIONS,
    LEVELS,
} from 'src/app/shared/constants/app';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputTextareaModule,
        InputGroupModule,
        InputGroupAddonModule,
        RadioButtonModule,
        CheckboxModule,
    ],
    templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
    countries: any[] = COUNTRIES;

    levels: any[] = LEVELS;



    estudantes: SelectItem[] = [];

    id: string[] = [];

   reviews1: SelectItem[] = [];

    payment_ways: any[] = ['Multicaixa', 'Transferência Bancária', 'Dinheiro'];

    reference_monthly_sent: any[] = ['Enviar por E-mail', 'Enviar por SMS'];

    entities: SelectItem[] = ENTITIES;

    discounts: SelectItem[] = DISCOUNTS;

    valRadio: string = '';

    valCheck: string[] = [];

    ngOnInit() {

        this.estudantes = [
            {label: 'João Mateus Diogo', value: 234234 },
            {label: 'Guilherme Francisco Mario', value: 234234},
            {label: 'Antonio Mendes Pereira', value: 93234},
            {label: 'Ana Sampaio', value:13123}
        ]

        this.reviews1 = [
            {label:'Mau', value:12},
            {label:'Mediano', value:30},
            {label:'Bom', value:50},
            {label:'Melhor',value:10}

        ]
    }
}
