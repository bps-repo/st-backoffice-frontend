import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SelectItem, MessageService, ConfirmationService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {TableCreateInvoice} from 'src/app/shared/components/tables/table-create-invoice/table-create-invoice.component';
import {
    COUNTRIES,
    DISCOUNTS,
    ENTITIES,
    INSTALATIONS,
    LEVELS,
} from 'src/app/shared/constants/app';
import {InvoiceItem} from 'src/app/core/models/invoice/invoice.model';
import {InvoiceService} from 'src/app/core/services/invoice.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        TableCreateInvoice,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
    invoiceForm!: FormGroup;
    loading = false;
    invoiceItems: InvoiceItem[] = [];

    // Dropdown options
    countries: any[] = COUNTRIES;
    levels: any[] = LEVELS;
    estudantes: SelectItem[] = [];
    payment_ways: any[] = ['Multicaixa', 'Transferência Bancária', 'Dinheiro'];
    reference_monthly_sent: any[] = ['Enviar por E-mail', 'Enviar por SMS'];
    entities: SelectItem[] = ENTITIES;
    discounts: SelectItem[] = DISCOUNTS;
    instalations: any[] = INSTALATIONS;

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.loadDropdownOptions();
    }

    initForm() {
        this.invoiceForm = this.fb.group({
            clientId: [null, Validators.required],
            paymentMethod: [null, Validators.required],
            invoiceNumber: ['', Validators.required],
            series: [{value: '2025', disabled: true}],
            discountType: [null],
            emissionDate: [new Date(), Validators.required],
            dueDate: [new Date(new Date().setDate(new Date().getDate() + 30)), Validators.required],
            retention: [0],
            notes: ['']
        });
    }

    loadDropdownOptions() {
        this.estudantes = [
            {label: 'João Mateus Diogo', value: 234234},
            {label: 'Guilherme Francisco Mario', value: 234234},
            {label: 'Antonio Mendes Pereira', value: 93234},
            {label: 'Ana Sampaio', value: 13123},
        ];
    }

    onItemsUpdated(items: InvoiceItem[]) {
        this.invoiceItems = items;
    }

    saveInvoice() {
        if (this.invoiceForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha todos os campos obrigatórios'
            });
            return;
        }

        if (this.invoiceItems.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Adicione pelo menos um item à fatura'
            });
            return;
        }

        this.loading = true;
        const invoiceData = {
            ...this.invoiceForm.getRawValue(),
            items: this.invoiceItems
        };

        this.invoiceService.createInvoice(invoiceData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Fatura criada com sucesso'
                });
                this.loading = false;
                setTimeout(() => {
                    this.router.navigate(['/modules/invoices/invoices']);
                }, 1500);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar fatura: ' + error.message
                });
                this.loading = false;
            }
        });
    }

    confirmCancel() {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja cancelar? Todas as alterações serão perdidas.',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.router.navigate(['/modules/invoices/invoices']);
            }
        });
    }
}
