import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import {
    InvoiceDetail,
    InvoicePayment,
    INVOICE_PAYMENT_METHOD_OPTIONS,
    getInvoiceDocumentTypeLabel,
} from 'src/app/core/models/invoice/invoice.model';
import { PaymentMethod } from 'src/app/core/models/payment/installment';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { SalesActions } from 'src/app/core/store/finance/sales/sales.actions';
import { selectSalesDetailError, selectSalesDetailLoading, selectSelectedSale } from 'src/app/core/store/finance/sales/sales.selectors';
import { PaymentMethodLabelPipe } from 'src/app/shared/pipes/payment-method-label.pipe';
import { ShowToastErrorService } from 'src/app/shared/services/show-toast-error-service';

@Component({
    selector: 'app-sale-detail',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        ProgressSpinnerModule,
        TableModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        ToastModule,
        FormsModule,
        PaymentMethodLabelPipe,
    ],
    providers: [MessageService],
    templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private readonly store = inject(Store);
    private invoiceService = inject(InvoiceService);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    /** NgRx — `selectSalesDetailLoading`. */
    readonly loading$ = this.store.select(selectSalesDetailLoading).pipe(distinctUntilChanged());

    saleId: string | null = null;
    sale: InvoiceDetail | null = null;
    error: string | null = null;

    showPaymentDialog = false;
    paymentSubmitting = false;
    issuingReceipt = false;
    loadingPayments = false;
    paymentMethod: PaymentMethod | null = PaymentMethod.CASH;
    paymentAmount: number | null = null;
    payments: InvoicePayment[] = [];

    readonly paymentMethodOptions = INVOICE_PAYMENT_METHOD_OPTIONS;

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.store.select(selectSelectedSale)
            .pipe(takeUntil(this.destroy$))
            .subscribe((sale) => {
                this.sale = sale;
                this.cdr.markForCheck();
            });

        this.store.select(selectSalesDetailError)
            .pipe(takeUntil(this.destroy$))
            .subscribe((error) => {
                this.error = error ? `Erro ao carregar detalhes da venda: ${error?.message || error}` : null;
                this.cdr.markForCheck();
            });

        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            this.saleId = params['id'];
            if (this.saleId) {
                this.loadSaleDetails();
                this.loadPayments();
            }
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadSaleDetails(): void {
        if (!this.saleId) return;
        this.store.dispatch(SalesActions.loadSaleDetails({ id: this.saleId }));
    }

    loadPayments(): void {
        if (!this.saleId) return;

        this.loadingPayments = true;
        this.invoiceService
            .getInvoicePayments(this.saleId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ data }) => {
                    this.payments = data ?? [];
                    this.loadingPayments = false;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    this.loadingPayments = false;
                    ShowToastErrorService.showToastError('Erro ao carregar pagamentos', error, this.messageService);
                    this.cdr.detectChanges();
                },
            });
    }

    getStatusSeverity(status: string): string {
        switch ((status || '').toUpperCase()) {
            case 'PAID':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getTypeSeverity(type: string): string {
        switch ((type || '').toUpperCase()) {
            case 'BOOK':
                return 'info';
            case 'CERTIFICATE':
                return 'warning';
            case 'DECLARATION':
                return 'danger';
            case 'GENERAL':
                return 'success';
            default:
                return 'secondary';
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatStatus(status: string): string {
        switch ((status || '').toUpperCase()) {
            case 'PAID':
                return 'Pago';
            case 'PENDING':
                return 'Pendente';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return status;
        }
    }

    formatDocumentType(type: string): string {
        return getInvoiceDocumentTypeLabel(type);
    }

    goBack(): void {
        this.router.navigate(['/finances/sales']);
    }

    downloadProof(): void {
        console.log('Downloading proof for sale:', this.saleId);
        // Implementation for downloading proof
    }

    sendInvoiceByEmail(): void {
        console.log('Sending invoice by email for sale:', this.saleId);
        // Implementation for sending invoice by email
    }

    issueReceipt(): void {
        if (!this.saleId || this.issuingReceipt) return;

        this.issuingReceipt = true;
        this.cdr.detectChanges();

        this.invoiceService
            .issueInvoiceReceipt(this.saleId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.issuingReceipt = false;
                    this.messageService.add({
                        life: 5000,
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Recibo emitido com sucesso.',
                    });
                    this.loadSaleDetails();
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    this.issuingReceipt = false;
                    ShowToastErrorService.showToastError('Erro ao emitir recibo', error, this.messageService);
                    this.cdr.detectChanges();
                },
            });
    }

    get canRegisterPayment(): boolean {
        return !!this.sale && !this.sale.paid && (this.sale.pendingAmount ?? 0) > 0;
    }

    openPaymentDialog(): void {
        if (!this.sale) return;

        this.paymentMethod = (this.sale.paymentMethod as PaymentMethod) || PaymentMethod.CASH;
        this.paymentAmount = this.sale.pendingAmount ?? this.sale.amount ?? 0;
        this.showPaymentDialog = true;
    }

    closePaymentDialog(): void {
        this.showPaymentDialog = false;
        this.paymentSubmitting = false;
    }

    registerPayment(): void {
        if (!this.saleId || !this.paymentMethod || this.paymentAmount == null || this.paymentAmount < 0.01) {
            this.messageService.add({
                life: 5000,
                severity: 'error',
                summary: 'Validação',
                detail: 'Selecione o método de pagamento e informe um valor mínimo de 0,01.',
            });
            return;
        }

        this.paymentSubmitting = true;
        this.cdr.detectChanges();

        this.invoiceService
            .createInvoicePayment(this.saleId, {
                paymentMethod: this.paymentMethod,
                amount: this.paymentAmount,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.paymentSubmitting = false;
                    this.showPaymentDialog = false;
                    this.messageService.add({
                        life: 5000,
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Pagamento registado com sucesso.',
                    });
                    this.loadSaleDetails();
                    this.loadPayments();
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    this.paymentSubmitting = false;
                    ShowToastErrorService.showToastError('Erro ao registar pagamento', error, this.messageService);
                    this.cdr.detectChanges();
                },
            });
    }
}
