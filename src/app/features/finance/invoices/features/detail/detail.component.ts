import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Invoice, InvoiceStatus} from 'src/app/core/models/invoice/invoice.model';
import {InvoiceService} from 'src/app/core/services/invoice.service';
import {mockInvoice} from "../invoice.contants";

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        TableModule,
        ToastModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
    invoice: Invoice | null = null;
    loading = true;
    showPrintDialog = false;
    showEmailDialog = false;
    emailAddress = '';

    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
    }

    ngOnInit(): void {
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
                this.invoice = mockInvoice;
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

    getStatusClass(status: string): string {
        switch (status) {
            case InvoiceStatus.PAID:
                return 'bg-green-100 text-green-700 px-2 py-1 rounded-md';
            case InvoiceStatus.PENDING:
                return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md';
            case InvoiceStatus.OVERDUE:
                return 'bg-red-100 text-red-700 px-2 py-1 rounded-md';
            case InvoiceStatus.CANCELLED:
                return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-md';
            default:
                return 'bg-blue-100 text-blue-700 px-2 py-1 rounded-md';
        }
    }

    navigateToEdit(): void {
        if (this.invoice) {
            this.router.navigate(['/modules/invoices/invoices/edit', this.invoice.id]);
        }
    }

    confirmMarkAsPaid(): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja marcar esta fatura como paga?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.invoice) {
                    this.markAsPaid(this.invoice.id!);
                }
            }
        });
    }

    markAsPaid(id: number): void {
        this.invoiceService.markAsPaid(id).subscribe({
            next: (data) => {
                this.invoice = data;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Fatura marcada como paga'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar o status da fatura: ' + error.message
                });
            }
        });
    }

    confirmCancel(): void {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja cancelar esta fatura?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.invoice) {
                    this.cancelInvoice(this.invoice.id!);
                }
            }
        });
    }

    cancelInvoice(id: number): void {
        this.invoiceService.markAsCancelled(id).subscribe({
            next: (data) => {
                this.invoice = data;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Fatura cancelada com sucesso'
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao cancelar a fatura: ' + error.message
                });
            }
        });
    }

    openPrintDialog(): void {
        this.showPrintDialog = true;
    }

    printInvoice(): void {
        // Implement print functionality
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Fatura enviada para impressão'
        });
        this.showPrintDialog = false;
    }

    openEmailDialog(): void {
        this.showEmailDialog = true;
    }

    sendInvoiceByEmail(): void {
        // Implement email functionality
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Fatura enviada para ${this.emailAddress}`
        });
        this.showEmailDialog = false;
        this.emailAddress = '';
    }

    goBack(): void {
        this.router.navigate(['/modules/invoices/invoices']);
    }
}
