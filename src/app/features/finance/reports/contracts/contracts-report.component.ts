import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import {
    FinanceContractReportRow,
    FinanceContractStatus,
    FinanceContractType,
} from 'src/app/core/models/finance/contracts-report.model';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import * as EmployeesSelectors from 'src/app/core/store/corporate/employees/employees.selectors';

@Component({
    selector: 'app-contracts-report',
    standalone: true,
    templateUrl: './contracts-report.component.html',
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ButtonModule,
        TableModule,
        TagModule,
        SkeletonModule,
        PaginatorModule,
    ],
})
export class ContractsReportComponent implements OnInit {
    private readonly service = inject(FinanceDashboardService);
    private readonly store = inject(Store);
    readonly loading$ = new BehaviorSubject<boolean>(false);

    readonly statusOptions: SelectItem[] = [
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Concluído', value: 'COMPLETED' },
        { label: 'Cancelado', value: 'CANCELLED' },
        { label: 'Em atraso', value: 'OVERDUE' },
        { label: 'Pagamento pendente', value: 'PENDING_PAYMENT' },
        { label: 'Pagamento estendido', value: 'EXTENDED_PAYMENT' },
        { label: 'Em espera', value: 'HOLD' },
    ];

    readonly contractTypeOptions: SelectItem[] = [
        { label: 'Standard', value: 'STANDARD' },
        { label: 'VIP', value: 'VIP' },
    ];

    centerOptions: SelectItem[] = [{ label: 'Todos os centros', value: '' }];
    sellerOptions: SelectItem[] = [{ label: 'Todos os vendedores', value: '' }];

    rows: FinanceContractReportRow[] = [];
    error: string | null = null;

    dateRange: Date[] = [];
    selectedStatuses: FinanceContractStatus[] = [];
    selectedContractTypes: FinanceContractType[] = [];
    selectedSellerId = '';
    selectedCenterId = '';

    page = 0;
    size = 20;
    totalRecords = 0;

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(EmployeesActions.loadEmployees());

        this.store
            .select(CenterSelectors.selectAllCenters)
            .pipe(takeUntilDestroyed())
            .subscribe((centers) => {
                this.centerOptions = [
                    { label: 'Todos os centros', value: '' },
                    ...centers.map((c) => ({ label: c.name, value: c.id })),
                ];
            });

        this.store
            .select(EmployeesSelectors.selectAllEmployees)
            .pipe(takeUntilDestroyed())
            .subscribe((employees) => {
                this.sellerOptions = [
                    { label: 'Todos os vendedores', value: '' },
                    ...employees.map((e) => ({
                        label: `${e.personalInfo.firstName} ${e.personalInfo.lastName}`.trim(),
                        value: e.id,
                    })),
                ];
            });

        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.load();
    }

    applyFilter(): void {
        this.page = 0;
        this.load();
    }

    clearFilter(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.selectedStatuses = [];
        this.selectedContractTypes = [];
        this.selectedSellerId = '';
        this.selectedCenterId = '';
        this.page = 0;
        this.load();
    }

    retryLoad(): void {
        this.load();
    }

    onPageChange(event: PaginatorState): void {
        this.page = event.page ?? 0;
        this.size = event.rows ?? 20;
        this.load();
    }

    formatMoney(value: number): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2,
        }).format(value);
    }

    private load(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        const dateFrom = this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo);
        const dateTo = this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today);

        this.loading$.next(true);
        this.error = null;

        this.service
            .getFinanceContractsReport({
                dateFrom,
                dateTo,
                status: this.selectedStatuses.length ? this.selectedStatuses : undefined,
                contractType: this.selectedContractTypes.length ? this.selectedContractTypes : undefined,
                sellerId: this.selectedSellerId || undefined,
                centerId: this.selectedCenterId || undefined,
                page: this.page,
                size: this.size,
            })
            .pipe(
                finalize(() => {
                    this.loading$.next(false);
                }),
            )
            .subscribe({
                next: (res) => {
                    this.rows = res.content ?? [];
                    this.totalRecords = res.totalElements ?? 0;
                },
                error: () => {
                    this.rows = [];
                    this.totalRecords = 0;
                    this.error = 'Não foi possível carregar o relatório de contratos.';
                },
            });
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
