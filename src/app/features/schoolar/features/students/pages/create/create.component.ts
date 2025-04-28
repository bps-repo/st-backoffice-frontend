import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import {
    COUNTRIES,
    DISCOUNTS,
    ENTITIES,
    INSTALATIONS,
    LEVELS,
} from 'src/app/shared/constants/app';

@Component({
    selector: 'app-student-create',
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
        CardModule,
        CalendarModule
    ],
    templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
    student: any = {
        personalData: {
            fullName: '',
            idType: null,
            idNumber: '',
            country: null,
            gender: '',
            birthDate: null,
            address: '',
            email: '',
            photo: null
        },
        enrollmentData: {
            installation: null,
            registrationType: null,
            status: 'active',
            entity: null,
            automaticDiscount: null,
            paymentMethod: null,
            monthlyReference: null,
            observations: '',
            termsAccepted: {
                responsibility: false,
                communication: false,
                emailMarketing: false,
                dataProcessing: false,
                emailInvoices: false
            }
        }
    };

    idTypes: SelectItem[] = [];
    countries: any[] = COUNTRIES;
    levels: any[] = LEVELS;
    installations: SelectItem[] = [];
    paymentMethods: SelectItem[] = [];
    referenceOptions: SelectItem[] = [];
    entities: SelectItem[] = ENTITIES;
    discounts: SelectItem[] = DISCOUNTS;

    genderOptions: SelectItem[] = [
        { label: 'Masculino', value: 'male' },
        { label: 'Femenino', value: 'female' }
    ];

    statusOptions: SelectItem[] = [
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' }
    ];

    ngOnInit() {
        // Initialize dropdown options
        this.idTypes = [
            { label: 'Bilhete de identidade', value: 'bi' },
            { label: 'Passaporte', value: 'passport' },
            { label: 'Carta de Conduçao', value: 'license' },
        ];

        this.installations = INSTALATIONS.map(installation => ({
            label: installation,
            value: installation
        }));

        this.paymentMethods = [
            { label: 'Multicaixa', value: 'multicaixa' },
            { label: 'Transferência Bancária', value: 'bank_transfer' },
            { label: 'Dinheiro', value: 'cash' }
        ];

        this.referenceOptions = [
            { label: 'Enviar por E-mail', value: 'email' },
            { label: 'Enviar por SMS', value: 'sms' }
        ];
    }

    saveStudent() {
        // In a real application, you would save the student data using a service
        console.log('Student saved:', this.student);
        // Navigate back to the list page or show success message
    }
}
