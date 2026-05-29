import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ExportFormat, FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import {
    FinanceInvoiceDocumentType,
    FinanceInvoicePaymentStatus,
    FinanceInvoiceReportRow,
} from 'src/app/core/models/finance/invoices-report.model';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';

@Component({
    selector: 'app-invoices-report',
    standalone: true,
    templateUrl: './invoices-report.component.html',
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
export class InvoicesReportComponent implements OnInit {
    private readonly service = inject(FinanceDashboardService);
    private readonly store = inject(Store);
    private readonly destroyRef = inject(DestroyRef);

    readonly loading$ = new BehaviorSubject<boolean>(false);
    readonly documentTypeOptions: SelectItem[] = [
        { label: 'Proforma', value: 'PROFORMA' },
        { label: 'Recibo', value: 'RECEIPT' },
        { label: 'Relatório', value: 'REPORT' },
        { label: 'Geral', value: 'GENERAL' },
    ];
    readonly paymentStatusOptions: SelectItem[] = [
        { label: 'Pendente', value: 'PENDING' },
        { label: 'Parcialmente pago', value: 'PARTIALLY_PAID' },
        { label: 'Pago', value: 'PAID' },
    ];
    readonly formatOptions: SelectItem[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'CSV', value: 'csv' },
        { label: 'Excel', value: 'excel' },
    ];

    centerOptions: SelectItem[] = [{ label: 'Todos os centros', value: '' }];
    rows: FinanceInvoiceReportRow[] = [];
    error: string | null = null;
    exportLoading = false;
    dateRange: Date[] = [];
    selectedCenterId = '';
    selectedDocumentTypes: FinanceInvoiceDocumentType[] = [];
    selectedPaymentStatuses: FinanceInvoicePaymentStatus[] = [];
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

    get formattedDocumentTypes(): string {
        return this.selectedDocumentTypes
            .map((v) => this.documentTypeOptions.find((o) => o.value === v)?.label ?? v)
            .join(', ');
    }

    get formattedPaymentStatuses(): string {
        return this.selectedPaymentStatuses
            .map((v) => this.paymentStatusOptions.find((o) => o.value === v)?.label ?? v)
            .join(', ');
    }

    get selectedCenterLabel(): string {
        return this.centerOptions.find((o) => o.value === this.selectedCenterId)?.label ?? this.selectedCenterId;
    }

    clearDocumentTypes(): void {
        this.selectedDocumentTypes = [];
        this.page = 0;
        this.load();
    }

    clearPaymentStatuses(): void {
        this.selectedPaymentStatuses = [];
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
        this.store
            .select(CenterSelectors.selectAllCenters)
            .pipe(takeUntilDestroyed(this.destroyRef))
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
        this.filterVisible = false;
        this.page = 0;
        this.load();
    }

    clearFilter(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.selectedCenterId = '';
        this.selectedDocumentTypes = [];
        this.selectedPaymentStatuses = [];
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
            .exportFinanceInvoicesReport(
                {
                    dateFrom,
                    dateTo,
                    centerId: this.selectedCenterId || undefined,
                    documentType: this.selectedDocumentTypes.length ? this.selectedDocumentTypes : undefined,
                    paymentStatus: this.selectedPaymentStatuses.length ? this.selectedPaymentStatuses : undefined,
                },
                this.selectedExportFormat,
            )
            .pipe(finalize(() => (this.exportLoading = false)))
            .subscribe({
                next: (blob) => this.downloadBlob(blob, `finance-invoices-report.${this.selectedExportFormat}`),
                error: () => (this.error = 'Não foi possível exportar o relatório de faturas.'),
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
            .getFinanceInvoicesReport({
                dateFrom,
                dateTo,
                centerId: this.selectedCenterId || undefined,
                documentType: this.selectedDocumentTypes.length ? this.selectedDocumentTypes : undefined,
                paymentStatus: this.selectedPaymentStatuses.length ? this.selectedPaymentStatuses : undefined,
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
                    this.error = 'Não foi possível carregar o relatório de faturas.';
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
