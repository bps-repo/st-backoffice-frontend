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
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ExportFormat, FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { FinanceSellerReportRow } from 'src/app/core/models/finance/sellers-report.model';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import { EmployeesActions } from 'src/app/core/store/corporate/employees/employees.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import * as EmployeesSelectors from 'src/app/core/store/corporate/employees/employees.selectors';

@Component({
    selector: 'app-sellers-report',
    standalone: true,
    templateUrl: './sellers-report.component.html',
    imports: [CommonModule, FormsModule, CalendarModule, DropdownModule, ButtonModule, TableModule, TagModule, SkeletonModule],
})
export class SellersReportComponent implements OnInit {
    private readonly service = inject(FinanceDashboardService);
    private readonly store = inject(Store);

    readonly loading$ = new BehaviorSubject<boolean>(false);
    readonly formatOptions: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'CSV', value: 'csv' },
        { label: 'Excel', value: 'excel' },
    ];

    centerOptions: SelectItem[] = [{ label: 'Todos os centros', value: '' }];
    sellerOptions: SelectItem[] = [{ label: 'Todos os vendedores', value: '' }];

    rows: FinanceSellerReportRow[] = [];
    error: string | null = null;
    exportLoading = false;
    dateRange: Date[] = [];
    selectedSellerId = '';
    selectedCenterId = '';
    selectedExportFormat: ExportFormat = 'pdf';

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
        this.load();
    }

    clearFilter(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.selectedSellerId = '';
        this.selectedCenterId = '';
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
            .exportFinanceSellersReport(
                {
                    dateFrom,
                    dateTo,
                    sellerId: this.selectedSellerId || undefined,
                    centerId: this.selectedCenterId || undefined,
                },
                this.selectedExportFormat,
            )
            .pipe(finalize(() => (this.exportLoading = false)))
            .subscribe({
                next: (blob) => this.downloadBlob(blob, `finance-sellers-report.${this.selectedExportFormat}`),
                error: () => (this.error = 'Não foi possível exportar o relatório de vendedores.'),
            });
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
            .getFinanceSellersReport({
                dateFrom,
                dateTo,
                sellerId: this.selectedSellerId || undefined,
                centerId: this.selectedCenterId || undefined,
            })
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe({
                next: (res) => {
                    this.rows = res ?? [];
                },
                error: () => {
                    this.rows = [];
                    this.error = 'Não foi possível carregar o relatório de vendedores.';
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
