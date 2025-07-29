import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, SelectItem } from 'primeng/api';
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
import { StepsModule } from 'primeng/steps';
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
        CalendarModule,
        StepsModule
    ],
    templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
    activeIndex: number = 0;

    steps: MenuItem[] = [
        { label: 'Dados Pessoais' },
        { label: 'Dados Acadêmicos' },
        { label: 'Contato de Emergência' },
        { label: 'Observações' }
    ];

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
        academicData: {
            installation: null,
            registrationType: null,
            status: 'active',
            entity: null,
            automaticDiscount: null,
            paymentMethod: null,
            monthlyReference: null,
            termsAccepted: {
                responsibility: false,
                communication: false,
                emailMarketing: false,
                dataProcessing: false,
                emailInvoices: false
            }
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: '',
            address: ''
        },
        observations: ''
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

        // Set initial active step
        this.activeIndex = 0;

        console.log('Student creation form initialized with stepper');
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.activeIndex++;
        }
    }

    prevStep() {
        this.activeIndex--;
    }

    validateCurrentStep(): boolean {
        // Add validation logic for each step
        switch (this.activeIndex) {
            case 0: // Personal Data
                if (!this.student.personalData.fullName) {
                    // You could add proper validation messages here
                    console.log('Please enter the full name');
                    return false;
                }
                return true;

            case 1: // Academic Data
                if (!this.student.academicData.registrationType) {
                    console.log('Please select a registration type');
                    return false;
                }
                return true;

            case 2: // Emergency Contact
                if (!this.student.emergencyContact.name || !this.student.emergencyContact.phone) {
                    console.log('Please enter emergency contact name and phone');
                    return false;
                }
                return true;

            case 3: // Observations
                // No validation needed for observations
                return true;

            default:
                return true;
        }
    }

    goToStep(index: number) {
        // Only allow going to a step if all previous steps are valid
        if (index < this.activeIndex || this.validateStepsBeforeIndex(index)) {
            this.activeIndex = index;
        }
    }

    validateStepsBeforeIndex(targetIndex: number): boolean {
        // Validate all steps before the target index
        for (let i = 0; i < targetIndex; i++) {
            this.activeIndex = i;
            if (!this.validateCurrentStep()) {
                return false;
            }
        }
        return true;
    }

    saveStudent() {
        // Validate all steps before saving
        if (this.validateStepsBeforeIndex(this.steps.length)) {
            // In a real application, you would save the student data using a service
            console.log('Student saved:', this.student);
            // Navigate back to the general page or show success message
        }
    }
}
