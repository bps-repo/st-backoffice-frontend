import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
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
        SelectModule,
        SkeletonModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: './finance-overview-dashboard.component.html',
})
export class FinanceOverviewDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    readonly loading$: Observable<boolean> = this.store
        .select(selectFinanceOverviewLoading)
        .pipe(distinctUntilChanged());

    overview: FinanceOverview | null = null;
    error: string | null = null;
    dateRange: Date[] = [];

    // ── Charts ────────────────────────────────────────────────────────────────
    revenueChartData: any;
    revenueChartOptions: any;

    collectionChartData: any;
    collectionChartOptions: any;

    contractChartData: any;
    contractChartOptions: any;

    avgMetricsChartData: any;
    avgMetricsChartOptions: any;

    // ── Filter ────────────────────────────────────────────────────────────────
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

    applyFilter(): void { this.dispatchLoad(); }

    clearFilter(): void {
        this.dateRange = [];
        this.selectedCenterId = '';
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        this.store.dispatch(FinanceOverviewActions.loadOverview({
            filter: { dateFrom: this.toISODate(firstOfMonth), dateTo: this.toISODate(today) },
        }));
    }

    retryLoad(): void {
        this.store.dispatch(FinanceOverviewActions.clearError());
        this.dispatchLoad();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    formatCurrency(value: number, currency = 'AOA'): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency', currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value ?? 0);
    }

    formatCurrencyShort(value: number, currency = 'AOA'): string {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ${currency}`;
        if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K ${currency}`;
        return this.formatCurrency(value, currency);
    }

    get collectionRatePercent(): string {
        return (this.overview?.collectionRate ?? 0).toFixed(1) + '%';
    }

    get revenueGrowthPositive(): boolean {
        return (this.overview?.revenueGrowth ?? 0) >= 0;
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const filter: FinanceOverviewFilter = {};
        if (this.dateRange?.[0]) filter.dateFrom = this.toISODate(this.dateRange[0]);
        if (this.dateRange?.[1]) filter.dateTo   = this.toISODate(this.dateRange[1]);
        if (this.selectedCenterId) filter.centerId = this.selectedCenterId;
        this.store.dispatch(FinanceOverviewActions.loadOverview({ filter }));
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    private initCharts(data: FinanceOverview): void {
        const s        = getComputedStyle(document.documentElement);
        const text     = s.getPropertyValue('--text-color').trim()         || '#495057';
        const textMuted= s.getPropertyValue('--text-color-secondary').trim()|| '#6c757d';
        const border   = s.getPropertyValue('--surface-border').trim()      || '#dee2e6';
        const surface  = s.getPropertyValue('--surface-100').trim()         || '#f8f9fa';

        const primary  = s.getPropertyValue('--primary-500').trim()  || '#6366f1';
        const green    = s.getPropertyValue('--green-500').trim()     || '#22c55e';
        const yellow   = s.getPropertyValue('--yellow-500').trim()    || '#eab308';
        const red      = s.getPropertyValue('--red-500').trim()       || '#ef4444';
        const blue     = s.getPropertyValue('--blue-500').trim()      || '#3b82f6';
        const orange   = s.getPropertyValue('--orange-500').trim()    || '#f97316';

        const tooltipCurrency = (ctx: any) =>
            ` ${this.formatCurrency(ctx.parsed.y ?? ctx.parsed.x ?? ctx.parsed, data.currency)}`;

        // ── 1. Revenue Bar ────────────────────────────────────────────────────
        this.revenueChartData = {
            labels: ['Receita Total', 'Receita Mensal', 'Receita Anual', 'Média Mensal'],
            datasets: [{
                label: 'Valor',
                data: [data.totalRevenue, data.monthlyRevenue, data.yearlyRevenue, data.averageMonthlyIncome],
                backgroundColor: [
                    primary + 'cc',
                    blue    + 'cc',
                    green   + 'cc',
                    orange  + 'cc',
                ],
                borderColor: [primary, blue, green, orange],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }],
        };

        this.revenueChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: tooltipCurrency },
                },
            },
            scales: {
                x: {
                    ticks: { color: text, font: { weight: '500' } },
                    grid: { display: false },
                    border: { display: false },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textMuted,
                        callback: (v: number) => this.formatCurrencyShort(v, data.currency),
                    },
                    grid: { color: border },
                    border: { display: false },
                },
            },
        };

        // ── 2. Collection Doughnut ────────────────────────────────────────────
        this.collectionChartData = {
            labels: ['Cobrado', 'Pendente', 'Em Atraso'],
            datasets: [{
                data: [data.totalCollected, data.totalPending - data.overdueAmount, data.overdueAmount],
                backgroundColor: [green + 'dd', yellow + 'dd', red + 'dd'],
                hoverBackgroundColor: [green, yellow, red],
                borderColor: [green, yellow, red],
                borderWidth: 2,
            }],
        };

        this.collectionChartOptions = {
            cutout: '72%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: text, usePointStyle: true, padding: 20, font: { size: 12 } },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${ctx.label}: ${this.formatCurrency(ctx.parsed, data.currency)}`,
                    },
                },
            },
        };

        // ── 3. Contracts Horizontal Bar ───────────────────────────────────────
        this.contractChartData = {
            labels: ['Activos', 'Novos este Mês', 'Novos este Ano'],
            datasets: [{
                label: 'Contratos',
                data: [data.totalActiveContracts, data.newContractsThisMonth, data.newContractsThisYear],
                backgroundColor: [primary + 'cc', blue + 'cc', green + 'cc'],
                borderColor: [primary, blue, green],
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }],
        };

        this.contractChartOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.parsed.x} contrato(s)`,
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: textMuted, stepSize: 1 },
                    grid: { color: border },
                    border: { display: false },
                },
                y: {
                    ticks: { color: text, font: { weight: '600' } },
                    grid: { display: false },
                    border: { display: false },
                },
            },
        };

        // ── 4. Avg Metrics Polar Area ─────────────────────────────────────────
        this.avgMetricsChartData = {
            labels: ['Cobrado Mensal', 'Valor Médio Contrato', 'Receita Mensal', 'Média Mensal'],
            datasets: [{
                data: [
                    data.monthlyCollected,
                    data.averageContractValue,
                    data.monthlyRevenue,
                    data.averageMonthlyIncome,
                ],
                backgroundColor: [
                    green  + '99',
                    primary+ '99',
                    blue   + '99',
                    orange + '99',
                ],
                borderColor: [green, primary, blue, orange],
                borderWidth: 2,
            }],
        };

        this.avgMetricsChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: text, usePointStyle: true, padding: 16, font: { size: 11 } },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${ctx.label}: ${this.formatCurrency(ctx.parsed.r, data.currency)}`,
                    },
                },
            },
            scales: {
                r: {
                    ticks: {
                        display: false,
                        backdropColor: 'transparent',
                    },
                    grid: { color: border },
                },
            },
        };
    }
}
