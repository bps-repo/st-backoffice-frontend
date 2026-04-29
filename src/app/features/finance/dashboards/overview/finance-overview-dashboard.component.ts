import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
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
        CalendarModule,
        ButtonModule,
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

    constructor() {
        this.store.select(selectFinanceOverview)
            .pipe(takeUntilDestroyed())
            .subscribe((overview) => {
                console.log('overview', overview);
                this.overview = overview;
                if (overview) this.initCharts(overview);
            });

        this.store.select(selectFinanceOverviewError)
            .pipe(takeUntilDestroyed())
            .subscribe((error) => (this.error = error ? 'Não foi possível carregar a visão geral financeira.' : null));

        this.store.select(selectFinanceOverviewFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                if (filter.dateFrom) {
                    const from = new Date(filter.dateFrom + 'T00:00:00');
                    const to = filter.dateTo ? new Date(filter.dateTo + 'T00:00:00') : from;
                    this.dateRange = [from, to];
                }
            });
    }

    ngOnInit(): void {
        this.dispatchLoad();
    }

    applyFilter(): void {
        this.dispatchLoad();
    }

    clearFilter(): void {
        this.dateRange = [];
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
        this.store.dispatch(FinanceOverviewActions.loadOverview({ filter }));
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
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
