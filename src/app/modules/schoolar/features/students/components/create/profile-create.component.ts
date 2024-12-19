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
    templateUrl: './profile-create.component.html',
})
export class ProfileCreateComponent implements OnInit {
    countries: any[] = COUNTRIES;

    levels: any[] = LEVELS;

    ids: SelectItem[] = [];

    id: string[] = [];

    instalations: string[] = INSTALATIONS;

    payment_ways: any[] = ['Multicaixa', 'Transferência Bancária', 'Dinheiro'];

    reference_monthly_sent: any[] = ['Enviar por E-mail', 'Enviar por SMS'];

    entities: SelectItem[] = ENTITIES;

    discounts: SelectItem[] = DISCOUNTS;

    valRadio: string = '';

    valCheck: string[] = [];

    ngOnInit() {
        this.ids = [
            { label: 'Bilhete de identidade', value: '12345' },
            { label: 'Passaporte', value: '67890' },
            { label: 'Carta de Conduçao', value: '101112' },
        ];
    }
}
