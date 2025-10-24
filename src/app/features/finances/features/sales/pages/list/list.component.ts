import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
import { SalesService } from 'src/app/core/services/sales.service';
import { Sale, SaleFilter } from 'src/app/core/models/finance/sale.model';

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
    @ViewChild('mainHeader') mainHeader!: ElementRef;
    @ViewChild('viewSelector') viewSelector!: ElementRef;

    // Data observables
    sales$: Observable<Sale[]> = of([]);
    loading$: Observable<boolean> = of(false);
    error$: Observable<string | null> = of(null);

    // Local state
    sales: Sale[] = [];
    loading = false;
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

    constructor(
        private router: Router,
        private salesService: SalesService
    ) {}

    ngOnInit(): void {
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
        this.loading = true;
        this.error = null;

        const filter: SaleFilter = {
            searchTerm: this.searchTerm || undefined,
            type: this.typeFilter || undefined,
            status: this.statusFilter || undefined
        };

        this.salesService.getSales(filter).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (sales) => {
                this.sales = sales;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar vendas: ' + error.message;
                this.loading = false;
            }
        });
    }

    onViewChange(event: any): void {
        this.currentView = event.value;

        // Navigate to create page if "Nova Venda" is selected
        if (event.value === 'nova-venda') {
            this.router.navigate(['/finances/sales/create']);
        }
    }

    onSearchChange(): void {
        this.loadSales();
    }

    onFilterChange(): void {
        this.loadSales();
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

    viewSaleDetails(sale: Sale): void {
        this.router.navigate(['/finances/sales', sale.id]);
    }

    createNewSale(): void {
        this.router.navigate(['/finances/sales/create']);
    }

    retryLoadSales(): void {
        this.loadSales();
    }
}
