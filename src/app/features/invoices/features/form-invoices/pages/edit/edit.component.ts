import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableCreateInvoice } from 'src/app/shared/components/tables/table-create-invoice/table-create-invoice.component';
import {
    COUNTRIES,
    DISCOUNTS,
    ENTITIES,
    INSTALATIONS,
    LEVELS,
} from 'src/app/shared/constants/app';
import { Invoice } from 'src/app/core/models/invoice/invoice.model';
import { InvoiceService } from 'src/app/core/services/invoice.service';

@Component({
    selector: 'app-edit',
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
        TableCreateInvoice,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    invoice: Invoice | null = null;
    loading = true;

    countries: any[] = COUNTRIES;
    levels: any[] = LEVELS;
    students: SelectItem[] = [];
    id: string[] = [];
    reviews1: SelectItem[] = [];
    payment_ways: any[] = ['Multicaixa', 'Transferência Bancária', 'Dinheiro'];
    reference_monthly_sent: any[] = ['Enviar por E-mail', 'Enviar por SMS'];
    entities: SelectItem[] = ENTITIES;
    discounts: SelectItem[] = DISCOUNTS;
    instalations: any[] = INSTALATIONS;
    valRadio: string = '';
    valCheck: string[] = [];

    // Form fields
    invoiceNumber: string = '';
    clientId: any;
    paymentMethod: any;
    series: any;
    discountType: any;
    emissionDate: Date | null = null;
    dueDate: Date | null = null;
    retention: number = 0;
    notes: string = '';

    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.students = [
            { label: 'João Mateus Diogo', value: 234234 },
            { label: 'Guilherme Francisco Mario', value: 234234 },
            { label: 'Antonio Mendes Pereira', value: 93234 },
            { label: 'Ana Sampaio', value: 13123 },
        ];

        this.reviews1 = [
            { label: 'Mau', value: 12 },
            { label: 'Mediano', value: 30 },
            { label: 'Bom', value: 50 },
            { label: 'Melhor', value: 10 },
        ];

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadInvoice(+id);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'ID da fatura não encontrado'
            });
            this.loading = false;
        }
    }

    loadInvoice(id: number): void {
        this.loading = true;
        this.invoiceService.getInvoice(id).subscribe({
            next: (data) => {
                this.invoice = data;
                this.populateFormFields();
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar a fatura: ' + error.message
                });
                this.loading = false;
            }
        });
    }

    populateFormFields(): void {
        if (this.invoice) {
            this.invoiceNumber = this.invoice.invoice_number || '';
            this.paymentMethod = this.invoice.payment_method;
            this.emissionDate = this.invoice.emission_date ? new Date(this.invoice.emission_date) : null;
            this.dueDate = this.invoice.due_date ? new Date(this.invoice.due_date) : null;
            this.retention = this.invoice.retention || 0;
            this.notes = this.invoice.notes || '';

            // Set the form values for dropdown selections
            this.id[1] = this.clientId;
            this.id[2] = this.series;
            this.id[3] = this.paymentMethod;
        }
    }

    saveInvoice(): void {
        if (!this.invoice) return;

        // Update invoice with form values
        this.invoice.invoice_number = this.invoiceNumber;
        this.invoice.payment_method = this.paymentMethod;
        this.invoice.emission_date = this.emissionDate!;
        this.invoice.due_date = this.dueDate!;
        this.invoice.retention = this.retention;
        this.invoice.notes = this.notes;

        this.invoiceService.updateInvoice(this.invoice).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Fatura atualizada com sucesso'
                });
                setTimeout(() => {
                    this.router.navigate(['/modules/invoices/invoices']);
                }, 1500);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar a fatura: ' + error.message
                });
            }
        });
    }

    confirmCancel(): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja cancelar a edição? Todas as alterações serão perdidas.',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.router.navigate(['/modules/invoices/invoices']);
            }
        });
    }
}
