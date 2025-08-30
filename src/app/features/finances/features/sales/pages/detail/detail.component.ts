import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SalesService } from 'src/app/core/services/sales.service';
import { Sale } from 'src/app/core/models/finance/sale.model';

@Component({
    selector: 'app-sale-detail',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        ProgressSpinnerModule
    ],
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
    saleId: string | null = null;
    loading = false;
    sale: Sale | null = null;
    error: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private salesService: SalesService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.saleId = params['id'];
            if (this.saleId) {
                this.loadSaleDetails();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadSaleDetails(): void {
        if (!this.saleId) return;

        this.loading = true;
        this.error = null;

        this.salesService.getSaleById(this.saleId).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (sale) => {
                this.sale = sale;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar detalhes da venda: ' + error.message;
                this.loading = false;
            }
        });
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Pago':
                return 'success';
            case 'Pendente':
                return 'warning';
            case 'Cancelado':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getTypeSeverity(type: string): string {
        switch (type) {
            case 'Livro':
                return 'info';
            case 'Certificado':
                return 'warning';
            case 'Declaração':
                return 'danger';
            case 'Serviço':
                return 'success';
            default:
                return 'secondary';
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
