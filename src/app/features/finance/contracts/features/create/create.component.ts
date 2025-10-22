import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Store} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Router} from '@angular/router';

@Component({
    selector: 'app-create-contract',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        InputTextareaModule,
        ToastModule
    ],
    providers: [MessageService]
})
export class CreateComponent implements OnInit {
    students: Student[] = [];
    selectedStudent: Student | null = null;
    contractForm: FormGroup;
    loading = false;

    contractTypes = [
        {label: 'Curso Completo', value: 'FULL_COURSE'},
        {label: 'Mensal', value: 'MONTHLY'},
        {label: 'Trimestral', value: 'QUARTERLY'},
        {label: 'Anual', value: 'ANNUAL'}
    ];

    paymentFrequencies = [
        {label: 'Mensal', value: 'MONTHLY'},
        {label: 'Trimestral', value: 'QUARTERLY'},
        {label: 'Semestral', value: 'SEMI_ANNUAL'},
        {label: 'Anual', value: 'ANNUAL'},
        {label: 'Único', value: 'ONE_TIME'}
    ];

    statuses = [
        {label: 'Ativo', value: 'ACTIVE'},
        {label: 'Pendente', value: 'PENDING'},
        {label: 'Expirado', value: 'EXPIRED'},
        {label: 'Cancelado', value: 'CANCELLED'}
    ];

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router
    ) {
        this.contractForm = this.fb.group({
            student: [null, Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            contractType: [null, Validators.required],
            paymentFrequency: [null, Validators.required],
            paymentAmount: [null, [Validators.required, Validators.min(0)]],
            status: ['ACTIVE', Validators.required],
            terms: ['', Validators.required]
        });
    }

    ngOnInit(): void {}



    onSubmit(): void {
        if (this.contractForm.invalid) {
            this.contractForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha todos os campos obrigatórios.'
            });
            return;
        }

        this.loading = true;

        // Simulando criação de contrato
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Contrato criado com sucesso!'
            });
            this.router.navigate(['/finances/contracts']);
        }, 1000);
    }

    cancel(): void {
        this.router.navigate(['/finances/contracts']);
    }
}
