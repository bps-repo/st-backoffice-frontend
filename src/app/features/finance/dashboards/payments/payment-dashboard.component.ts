import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { FinancePaymentDashboardActions } from 'src/app/core/store/finance/payment-dashboard/payment-dashboard.actions';
import {
    selectFinancePaymentDashboardError,
    selectFinancePaymentDashboardFilter,
    selectFinancePaymentDashboardLoading,
    selectFinancePaymentDashboardSummary,
    selectFinancePaymentDashboardTrends,
} from 'src/app/core/store/finance/payment-dashboard/payment-dashboard.selectors';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { PaymentDashboardFilter, PaymentSummary, PaymentTrends } from 'src/app/core/models/finance/payment-dashboard.model';

const MONTH_LABELS: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH: 'Mar',  APRIL:    'Abr',
    MAY:     'Mai', JUNE:     'Jun', JULY:  'Jul',  AUGUST:   'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

// Dataset colours — first = Pago (green), second = Pendente (yellow), fallback = blue
const DS_COLORS = [
    { line: '#22c55e', fill: '#22c55e26' },
    { line: '#eab308', fill: '#eab30826' },
    { line: '#3b82f6', fill: '#3b82f626' },
    { line: '#f97316', fill: '#f9731626' },
];

@Component({
    selector: 'app-payment-dashboard',
    templateUrl: './payment-dashboard.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        DatePickerModule,
        SelectModule,
        ButtonModule,
        SkeletonModule,
        TagModule,
    ],
})
export class PaymentDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    readonly loading$: Observable<boolean> = this.store
        .select(selectFinancePaymentDashboardLoading)
        .pipe(distinctUntilChanged());

    summary: PaymentSummary | null = null;
    error: string | null = null;
    dateRange: Date[] = [];
    selectedCenterId = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    // ── Charts ────────────────────────────────────────────────────────────────
    trendsChartData: any;
    trendsChartOptions: any;

    distributionChartData: any;
    distributionChartOptions: any;

    summaryBarData: any;
    summaryBarOptions: any;

    constructor() {
        this.store.select(selectFinancePaymentDashboardSummary)
            .pipe(takeUntilDestroyed())
            .subscribe((s) => {
                this.summary = s;
                if (s) this.initDistributionChart(s);
                if (s) this.initSummaryBarChart(s);
            });

        this.store.select(selectFinancePaymentDashboardTrends)
            .pipe(takeUntilDestroyed())
            .subscribe((t) => { if (t) this.initTrendsChart(t); });

        this.store.select(selectFinancePaymentDashboardError)
            .pipe(takeUntilDestroyed())
            .subscribe((err) => (this.error = err ? 'Não foi possível carregar o painel de pagamentos.' : null));

        this.store.select(selectFinancePaymentDashboardFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                this.selectedCenterId = filter.centerId ?? '';
                if (filter.dateFrom && filter.dateTo) {
                    this.dateRange = [
                        new Date(filter.dateFrom + 'T00:00:00'),
                        new Date(filter.dateTo   + 'T00:00:00'),
                    ];
                }
            });
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.dispatchLoad();
    }

    applyFilter(): void  { this.dispatchLoad(); }

    clearFilter(): void {
        this.selectedCenterId = '';
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange   = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(FinancePaymentDashboardActions.clearError());
        this.dispatchLoad();
    }

    // ── Computed getters ──────────────────────────────────────────────────────

    get collectionRatePercent(): string {
        if (!this.summary) return '0%';
        const total = this.summary.totalPaid + this.summary.pendingAmount + this.summary.overdueAmount;
        if (total === 0) return '0%';
        return ((this.summary.totalPaid / total) * 100).toFixed(1) + '%';
    }

    get overdueRatePercent(): string {
        if (!this.summary) return '0%';
        const total = this.summary.totalPaid + this.summary.pendingAmount + this.summary.overdueAmount;
        if (total === 0) return '0%';
        return ((this.summary.overdueAmount / total) * 100).toFixed(1) + '%';
    }

    formatMoney(value: number, currency: string): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency', currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value ?? 0);
    }

    formatMoneyShort(value: number, currency = 'AOA'): string {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K`;
        return String(Math.round(value));
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: PaymentDashboardFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:   this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
        };
        this.store.dispatch(FinancePaymentDashboardActions.load({ filter }));
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // ── 1. Area / Line — trends ───────────────────────────────────────────────
    private initTrendsChart(trends: PaymentTrends): void {
        const s        = getComputedStyle(document.documentElement);
        const text     = s.getPropertyValue('--text-color').trim()          || '#495057';
        const textMuted= s.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border   = s.getPropertyValue('--surface-border').trim()       || '#dee2e6';
        const currency = this.summary?.currency ?? 'AOA';

        this.trendsChartData = {
            labels: trends.labels.map((m) => MONTH_LABELS[m] ?? m),
            datasets: trends.datasets.map((ds, i) => {
                const c = DS_COLORS[i % DS_COLORS.length];
                return {
                    label:           ds.label,
                    data:            ds.data,
                    borderColor:     c.line,
                    backgroundColor: c.fill,
                    pointBackgroundColor: c.line,
                    pointBorderColor:    '#fff',
                    pointBorderWidth:    2,
                    pointRadius:         5,
                    pointHoverRadius:    7,
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true,
                };
            }),
        };

        this.trendsChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 20 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y, currency)}`,
                    },
                },
            },
            scales: {
                x: {
                    ticks:  { color: text, font: { weight: '500' } },
                    grid:   { display: false },
                    border: { display: false },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textMuted,
                        callback: (v: number) => this.formatMoneyShort(v, currency),
                    },
                    grid:   { color: border },
                    border: { display: false },
                },
            },
        };
    }

    // ── 2. Doughnut — distribution ────────────────────────────────────────────
    private initDistributionChart(s: PaymentSummary): void {
        const style    = getComputedStyle(document.documentElement);
        const text     = style.getPropertyValue('--text-color').trim() || '#495057';
        const green    = style.getPropertyValue('--green-500').trim()  || '#22c55e';
        const yellow   = style.getPropertyValue('--yellow-500').trim() || '#eab308';
        const red      = style.getPropertyValue('--red-500').trim()    || '#ef4444';

        this.distributionChartData = {
            labels: ['Pagos', 'Pendente', 'Em Atraso'],
            datasets: [{
                data: [s.totalPaid, s.pendingAmount, s.overdueAmount],
                backgroundColor: [green + 'dd', yellow + 'dd', red + 'dd'],
                hoverBackgroundColor: [green, yellow, red],
                borderColor: [green, yellow, red],
                borderWidth: 2,
            }],
        };

        this.distributionChartOptions = {
            cutout: '74%',
            responsive:          true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: text, usePointStyle: true,
                        padding: 20, font: { size: 12 },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${ctx.label}: ${this.formatMoney(ctx.parsed, s.currency)}`,
                    },
                },
            },
        };
    }

    // ── 3. Horizontal bar — summary comparison ────────────────────────────────
    private initSummaryBarChart(s: PaymentSummary): void {
        const style    = getComputedStyle(document.documentElement);
        const text     = style.getPropertyValue('--text-color').trim()          || '#495057';
        const textMuted= style.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border   = style.getPropertyValue('--surface-border').trim()       || '#dee2e6';
        const green    = style.getPropertyValue('--green-500').trim()  || '#22c55e';
        const yellow   = style.getPropertyValue('--yellow-500').trim() || '#eab308';
        const red      = style.getPropertyValue('--red-500').trim()    || '#ef4444';
        const currency = s.currency;

        this.summaryBarData = {
            labels: ['Pagos', 'Pendente', 'Em Atraso'],
            datasets: [{
                label: 'Valor',
                data: [s.totalPaid, s.pendingAmount, s.overdueAmount],
                backgroundColor: [green + 'cc', yellow + 'cc', red + 'cc'],
                borderColor:     [green,          yellow,          red],
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }],
        };

        this.summaryBarOptions = {
            indexAxis: 'y',
            responsive:          true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${this.formatMoney(ctx.parsed.x, currency)}`,
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: textMuted,
                        callback: (v: number) => this.formatMoneyShort(v, currency),
                    },
                    grid:   { color: border },
                    border: { display: false },
                },
                y: {
                    ticks:  { color: text, font: { weight: '600', size: 13 } },
                    grid:   { display: false },
                    border: { display: false },
                },
            },
        };
    }
}
