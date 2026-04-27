import { ChangeDetectorRef, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { InvoiceDetail } from 'src/app/core/models/invoice/invoice.model';
import { SalesActions } from 'src/app/core/store/finance/sales/sales.actions';
import { selectSalesDetailError, selectSalesDetailLoading, selectSelectedSale } from 'src/app/core/store/finance/sales/sales.selectors';

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
        TableModule
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(Store);
    private cdr = inject(ChangeDetectorRef);

    saleId: string | null = null;
    loading = false;
    sale: InvoiceDetail | null = null;
    error: string | null = null;

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.store.select(selectSelectedSale)
            .pipe(takeUntil(this.destroy$))
            .subscribe((sale) => {
                this.sale = sale;
                this.cdr.markForCheck();
            });

        this.store.select(selectSalesDetailLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((loading) => {
                this.loading = loading;
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
        switch ((type || '').toUpperCase()) {
            case 'GENERAL':
                return 'Serviço';
            case 'BOOK':
                return 'Livro';
            case 'CERTIFICATE':
                return 'Certificado';
            case 'DECLARATION':
                return 'Declaração';
            default:
                return type;
        }
    }

    goBack(): void {
        this.router.navigate(['/finances/sales']);
    }

    editSale(): void {
        if (this.saleId) {
            this.router.navigate(['/finances/sales', this.saleId, 'edit']);
        }
    }

    downloadInvoice(): void {
        console.log('Downloading invoice for sale:', this.saleId);
        // Implementation for downloading invoice
    }

    downloadReceipt(): void {
        console.log('Downloading receipt for sale:', this.saleId);
        // Implementation for downloading receipt
    }

    downloadProof(): void {
        console.log('Downloading proof for sale:', this.saleId);
        // Implementation for downloading proof
    }

    sendInvoiceByEmail(): void {
        console.log('Sending invoice by email for sale:', this.saleId);
        // Implementation for sending invoice by email
    }

    printReceipt(): void {
        console.log('Printing receipt for sale:', this.saleId);
        // Implementation for printing receipt
    }
}
