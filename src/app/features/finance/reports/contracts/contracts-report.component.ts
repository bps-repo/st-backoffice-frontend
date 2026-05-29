import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ExportFormat, FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
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
        DatePickerModule,
        DropdownModule,
        MultiSelectModule,
        ButtonModule,
        TableModule,
        TagModule,
        SkeletonModule,
        PaginatorModule,
        ChipModule,
        DialogModule,
    ],
})
export class ContractsReportComponent implements OnInit {
    private readonly service = inject(FinanceDashboardService);
    private readonly store = inject(Store);
    private readonly destroyRef = inject(DestroyRef);

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
    readonly formatOptions: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'CSV', value: 'csv' },
        { label: 'Excel', value: 'excel' },
    ];

    rows: FinanceContractReportRow[] = [];
    error: string | null = null;
    exportLoading = false;

    dateRange: Date[] = [];
    selectedStatuses: FinanceContractStatus[] = [];
    selectedContractTypes: FinanceContractType[] = [];
    selectedSellerId = '';
    selectedCenterId = '';
    selectedExportFormat: ExportFormat = 'pdf';

    page = 0;
    size = 20;
    totalRecords = 0;
    filterVisible = false;

    get formattedDateRange(): string {
        const fmt = (d: Date) => d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
        if (!this.dateRange?.[0]) return '—';
        const to = this.dateRange[1] ? fmt(this.dateRange[1]) : '...';
        return `${fmt(this.dateRange[0])} - ${to}`;
    }

    get formattedStatuses(): string {
        return this.selectedStatuses
            .map((v) => this.statusOptions.find((o) => o.value === v)?.label ?? v)
            .join(', ');
    }

    get formattedContractTypes(): string {
        return this.selectedContractTypes
            .map((v) => this.contractTypeOptions.find((o) => o.value === v)?.label ?? v)
            .join(', ');
    }

    get selectedSellerLabel(): string {
        return this.sellerOptions.find((o) => o.value === this.selectedSellerId)?.label ?? this.selectedSellerId;
    }

    get selectedCenterLabel(): string {
        return this.centerOptions.find((o) => o.value === this.selectedCenterId)?.label ?? this.selectedCenterId;
    }

    clearStatuses(): void {
        this.selectedStatuses = [];
        this.page = 0;
        this.load();
    }

    clearContractTypes(): void {
        this.selectedContractTypes = [];
        this.page = 0;
        this.load();
    }

    clearSeller(): void {
        this.selectedSellerId = '';
        this.page = 0;
        this.load();
    }

    clearCenter(): void {
        this.selectedCenterId = '';
        this.page = 0;
        this.load();
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.store.dispatch(EmployeesActions.loadEmployees());

        this.store
            .select(CenterSelectors.selectAllCenters)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((centers) => {
                this.centerOptions = [
                    { label: 'Todos os centros', value: '' },
                    ...centers.map((c) => ({ label: c.name, value: c.id })),
                ];
            });

        this.store
            .select(EmployeesSelectors.selectAllEmployees)
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.filterVisible = false;
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

    exportData(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const dateFrom = this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo);
        const dateTo = this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today);

        this.exportLoading = true;

        this.service
            .exportFinanceContractsReport(
                {
                    dateFrom,
                    dateTo,
                    status: this.selectedStatuses.length ? this.selectedStatuses : undefined,
                    contractType: this.selectedContractTypes.length ? this.selectedContractTypes : undefined,
                    sellerId: this.selectedSellerId || undefined,
                    centerId: this.selectedCenterId || undefined,
                },
                this.selectedExportFormat,
            )
            .pipe(finalize(() => (this.exportLoading = false)))
            .subscribe({
                next: (blob) => this.downloadBlob(blob, `finance-contracts-report.${this.selectedExportFormat}`),
                error: () => (this.error = 'Não foi possível exportar o relatório de contratos.'),
            });
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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
