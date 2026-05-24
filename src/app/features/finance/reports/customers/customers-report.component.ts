import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ExportFormat, FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { FinanceCustomerReportRow } from 'src/app/core/models/finance/customers-report.model';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';

@Component({
    selector: 'app-customers-report',
    standalone: true,
    templateUrl: './customers-report.component.html',
    imports: [CommonModule, FormsModule, DatePickerModule, DropdownModule, ButtonModule, TableModule, SkeletonModule, PaginatorModule],
})
export class CustomersReportComponent implements OnInit {
    private readonly service = inject(FinanceDashboardService);
    private readonly store = inject(Store);
    readonly loading$ = new BehaviorSubject<boolean>(false);
    readonly formatOptions: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'CSV', value: 'csv' },
        { label: 'Excel', value: 'excel' },
    ];

    centerOptions: SelectItem[] = [{ label: 'Todos os centros', value: '' }];
    rows: FinanceCustomerReportRow[] = [];
    error: string | null = null;
    exportLoading = false;
    dateRange: Date[] = [];
    selectedCenterId = '';
    selectedExportFormat: ExportFormat = 'pdf';

    page = 0;
    size = 20;
    totalRecords = 0;

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.store
            .select(CenterSelectors.selectAllCenters)
            .pipe(takeUntilDestroyed())
            .subscribe((centers) => {
                this.centerOptions = [
                    { label: 'Todos os centros', value: '' },
                    ...centers.map((c) => ({ label: c.name, value: c.id })),
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
            .exportFinanceCustomersReport(
                {
                    dateFrom,
                    dateTo,
                    centerId: this.selectedCenterId || undefined,
                },
                this.selectedExportFormat,
            )
            .pipe(finalize(() => (this.exportLoading = false)))
            .subscribe({
                next: (blob) => this.downloadBlob(blob, `finance-customers-report.${this.selectedExportFormat}`),
                error: () => (this.error = 'Não foi possível exportar o relatório de clientes.'),
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
            .getFinanceCustomersReport({
                dateFrom,
                dateTo,
                centerId: this.selectedCenterId || undefined,
                page: this.page,
                size: this.size,
            })
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (res) => {
                    this.rows = res.content ?? [];
                    this.totalRecords = res.totalElements ?? 0;
                },
                error: () => {
                    this.rows = [];
                    this.totalRecords = 0;
                    this.error = 'Não foi possível carregar o relatório de clientes.';
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
