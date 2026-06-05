import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InvoiceListItem, getInvoiceDocumentTypeLabel } from 'src/app/core/models/invoice/invoice.model';
import { SalesActions } from 'src/app/core/store/finance/sales/sales.actions';
import { selectAllSales, selectSalesError, selectSalesLoading } from 'src/app/core/store/finance/sales/sales.selectors';

interface SaleListItem {
    id: string;
    clientName: string;
    clientEmail: string;
    productName: string;
    type: string;
    quantity: number;
    total: number;
    paymentStatus: string;
    date: string;
}

@Component({
    selector: 'app-sales-list',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        TableModule,
        TagModule,
        TooltipModule,
        FormsModule,
        SelectButtonModule,
        BadgeModule,
        ProgressSpinnerModule
    ],
    templateUrl: './list.component.html',
    styles: [`
        ::ng-deep .p-selectbutton {
            display: flex;
            flex-wrap: nowrap;
        }

        ::ng-deep .p-selectbutton .p-button {
            margin-right: 0.5rem;
            border: none;
        }

        ::ng-deep .p-selectbutton .p-button:last-child {
            margin-right: 0;
        }

        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding-top: 1rem;
            padding-bottom: 1rem;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .sticky-active {
            background-color: var(--surface-card);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .animate-fade {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
    `]
})
export class ListComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private readonly store = inject(Store);

    /** NgRx — `selectSalesLoading`. */
    readonly loading$ = this.store.select(selectSalesLoading).pipe(distinctUntilChanged());
    @ViewChild('mainHeader') mainHeader!: ElementRef;
    @ViewChild('viewSelector') viewSelector!: ElementRef;

    // Local state
    allSales: SaleListItem[] = [];
    sales: SaleListItem[] = [];
    error: string | null = null;
    searchTerm = '';
    typeFilter = '';
    statusFilter = '';

    // Sticky state tracking
    isMainHeaderSticky = false;
    isViewSelectorSticky = false;

    // View selection
    currentView: string = 'list';

    viewOptions = [
        { label: 'Lista de Vendas', value: 'list' },
        { label: 'Relatórios', value: 'relatorios' },
        { label: 'Estatísticas', value: 'estatisticas' },
        { label: 'Nova Venda', value: 'nova-venda' }
    ];

    // Filter options
    typeOptions = [
        { label: 'Todos os Tipos', value: '' },
        { label: 'Livro', value: 'Livro' },
        { label: 'Certificado', value: 'Certificado' },
        { label: 'Declaração', value: 'Declaração' },
        { label: 'Serviço', value: 'Serviço' }
    ];

    statusOptions = [
        { label: 'Todos os Status', value: '' },
        { label: 'Pago', value: 'Pago' },
        { label: 'Pendente', value: 'Pendente' },
        { label: 'Cancelado', value: 'Cancelado' }
    ];

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.store.select(selectAllSales)
            .pipe(takeUntil(this.destroy$))
            .subscribe((sales) => {
                const mappedSales = sales.map((invoice) => this.mapInvoiceToSale(invoice));
                this.allSales = mappedSales;
                this.sales = this.filterSales(this.allSales);
            });

        this.store.select(selectSalesError)
            .pipe(takeUntil(this.destroy$))
            .subscribe((error) => {
                this.error = error ? `Erro ao carregar vendas: ${error?.message || error}` : null;
            });

        this.loadSales();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(): void {
        this.updateStickyState();
    }

    private updateStickyState(): void {
        if (this.mainHeader) {
            const rect = this.mainHeader.nativeElement.getBoundingClientRect();
            this.isMainHeaderSticky = rect.top <= 0;
        }

        if (this.viewSelector) {
            const rect = this.viewSelector.nativeElement.getBoundingClientRect();
            this.isViewSelectorSticky = rect.top <= 80;
        }
    }

    loadSales(): void {
        this.store.dispatch(SalesActions.loadSales());
    }

    private mapInvoiceToSale(invoice: InvoiceListItem): SaleListItem {
        return {
            id: invoice.id,
            clientName: invoice.customer.fullName || '-',
            clientEmail: invoice.customer.email || '-',
            productName: invoice.items[0].productName || '-',
            type: this.normalizeType(invoice.documentType),
            quantity: invoice.items?.reduce((total, item) => total + item.quantity, 0) || 0,
            total: invoice.amount || 0,
            paymentStatus: this.normalizeStatus(invoice.paymentStatus),
            date: invoice.issueDate
        };
    }

    private filterSales(sales: SaleListItem[]): SaleListItem[] {
        const searchTerm = this.searchTerm.trim().toLowerCase();

        return sales.filter((sale) => {
            if (searchTerm) {
                const matchesSearch =
                    sale.clientName.toLowerCase().includes(searchTerm) ||
                    sale.productName.toLowerCase().includes(searchTerm);
                if (!matchesSearch) {
                    return false;
                }
            }

            if (this.typeFilter && sale.type !== this.typeFilter) {
                return false;
            }

            if (this.statusFilter && sale.paymentStatus !== this.statusFilter) {
                return false;
            }

            return true;
        });
    }

    private normalizeStatus(status: string): string {
        switch ((status || '').toLowerCase()) {
            case 'paid':
                return 'Pago';
            case 'cancelled':
                return 'Cancelado';
            case 'pending':
            default:
                return 'Pendente';
        }
    }

    private normalizeType(type: string): string {
        return getInvoiceDocumentTypeLabel(type);
    }

    onViewChange(event: any): void {
        this.currentView = event.value;

        // Navigate to create page if "Nova Venda" is selected
        if (event.value === 'nova-venda') {
            this.router.navigate(['/finances/sales/create']);
        }
    }

    onSearchChange(): void {
        this.sales = this.filterSales(this.allSales);
    }

    onFilterChange(): void {
        this.sales = this.filterSales(this.allSales);
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
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    viewSaleDetails(sale: SaleListItem): void {
        this.router.navigate(['/finances/sales', sale.id]);
    }

    createNewSale(): void {
        this.router.navigate(['/finances/sales/create']);
    }

    retryLoadSales(): void {
        this.loadSales();
    }
}
