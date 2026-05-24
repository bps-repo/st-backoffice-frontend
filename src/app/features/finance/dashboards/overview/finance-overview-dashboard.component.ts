import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { FinanceOverviewActions } from '../../../../core/store/finance/overview/finance-overview.actions';
import {
    selectFinanceOverview,
    selectFinanceOverviewError,
    selectFinanceOverviewFilter,
    selectFinanceOverviewLoading,
} from '../../../../core/store/finance/overview/finance-overview.selectors';
import { FinanceOverview, FinanceOverviewFilter } from '../../../../core/models/finance/finance-overview.model';

@Component({
    selector: 'app-finance-overview-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        DatePickerModule,
        ButtonModule,
        DropdownModule,
        SkeletonModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: './finance-overview-dashboard.component.html',
})
export class FinanceOverviewDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    /** Driven by NgRx `selectFinanceOverviewLoading` — use `(loading$ | async)` in the template. */
    readonly loading$: Observable<boolean> = this.store
        .select(selectFinanceOverviewLoading)
        .pipe(distinctUntilChanged());

    overview: FinanceOverview | null = null;
    error: string | null = null;
    dateRange: Date[] = [];

    revenueChartData: any;
    revenueChartOptions: any;
    collectionChartData: any;
    collectionChartOptions: any;
    contractChartData: any;
    contractChartOptions: any;

    /** Empty string = todos os centros (sem `centerId` na API). */
    selectedCenterId = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    constructor() {
        this.store.select(selectFinanceOverview)
            .pipe(takeUntilDestroyed())
            .subscribe((overview) => {
                this.overview = overview;
                if (overview) this.initCharts(overview);
            });

        this.store.select(selectFinanceOverviewError)
            .pipe(takeUntilDestroyed())
            .subscribe((error) => (this.error = error ? 'Não foi possível carregar a visão geral financeira.' : null));

        this.store.select(selectFinanceOverviewFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                this.selectedCenterId = filter.centerId ?? '';
                if (filter.dateFrom) {
                    const from = new Date(filter.dateFrom + 'T00:00:00');
                    const to = filter.dateTo ? new Date(filter.dateTo + 'T00:00:00') : from;
                    this.dateRange = [from, to];
                }
            });
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.dispatchLoad();
    }

    applyFilter(): void {
        this.dispatchLoad();
    }

    clearFilter(): void {
        this.dateRange = [];
        this.selectedCenterId = '';
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        this.store.dispatch(
            FinanceOverviewActions.loadOverview({
                filter: {
                    dateFrom: this.toISODate(firstOfMonth),
                    dateTo: this.toISODate(today),
                },
            }),
        );
    }

    retryLoad(): void {
        this.store.dispatch(FinanceOverviewActions.clearError());
        this.dispatchLoad();
    }

    private dispatchLoad(): void {
        const filter: FinanceOverviewFilter = {};
        if (this.dateRange?.[0]) filter.dateFrom = this.toISODate(this.dateRange[0]);
        if (this.dateRange?.[1]) filter.dateTo = this.toISODate(this.dateRange[1]);
        if (this.selectedCenterId) filter.centerId = this.selectedCenterId;
        this.store.dispatch(FinanceOverviewActions.loadOverview({ filter }));
    }

    private toISODate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private initCharts(data: FinanceOverview): void {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-color');
        const borderColor = style.getPropertyValue('--surface-border');

        this.revenueChartData = {
            labels: ['Receita Total', 'Cobrado', 'Pendente', 'Em Atraso'],
            datasets: [
                {
                    label: 'Valor (AOA)',
                    data: [data.totalRevenue, data.totalCollected, data.totalPending, data.overdueAmount],
                    backgroundColor: [
                        style.getPropertyValue('--primary-500'),
                        style.getPropertyValue('--green-500'),
                        style.getPropertyValue('--yellow-500'),
                        style.getPropertyValue('--red-500'),
                    ],
                    borderRadius: 6,
                },
            ],
        };

        this.revenueChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${this.formatCurrency(ctx.parsed.y, data.currency)}`,
                    },
                },
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: borderColor } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor,
                        callback: (v: number) => this.formatCurrency(v, data.currency),
                    },
                    grid: { color: borderColor },
                },
            },
        };

        this.collectionChartData = {
            labels: ['Cobrado', 'Por Cobrar'],
            datasets: [
                {
                    data: [data.totalCollected, data.totalPending],
                    backgroundColor: [
                        style.getPropertyValue('--green-500'),
                        style.getPropertyValue('--surface-300'),
                    ],
                    hoverBackgroundColor: [
                        style.getPropertyValue('--green-400'),
                        style.getPropertyValue('--surface-200'),
                    ],
                },
            ],
        };

        this.collectionChartOptions = {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, usePointStyle: true, padding: 16 },
                },
            },
        };

        this.contractChartData = {
            labels: ['Contratos Activos', 'Novos (mês)', 'Novos (ano)'],
            datasets: [
                {
                    label: 'Contratos',
                    data: [
                        data.totalActiveContracts,
                        data.newContractsThisMonth,
                        data.newContractsThisYear,
                    ],
                    backgroundColor: style.getPropertyValue('--primary-400'),
                    borderRadius: 6,
                },
            ],
        };

        this.contractChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 },
                    grid: { color: borderColor },
                },
            },
        };
    }

    formatCurrency(value: number, currency = 'AOA'): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(value);
    }

    get collectionRatePercent(): string {
        return (this.overview?.collectionRate ?? 0).toFixed(2) + '%';
    }

    get revenueGrowthPositive(): boolean {
        return (this.overview?.revenueGrowth ?? 0) >= 0;
    }
}
