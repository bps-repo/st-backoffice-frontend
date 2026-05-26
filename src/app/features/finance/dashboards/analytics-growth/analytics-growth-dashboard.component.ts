import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AnalyticsGrowthStore } from './analytics-growth.store';
import {
    AnalyticsGrowth,
    AnalyticsGrowthFilter,
    RevenueTrend,
} from 'src/app/core/models/finance/analytics-growth.model';

const MONTH_PT: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH:     'Mar', APRIL:    'Abr',
    MAY:     'Mai', JUNE:     'Jun', JULY:       'Jul', AUGUST:   'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

const CENTER_COLORS = [
    { solid: '#6366f1', light: '#6366f126' },
    { solid: '#22c55e', light: '#22c55e26' },
    { solid: '#f97316', light: '#f9731626' },
    { solid: '#3b82f6', light: '#3b82f626' },
    { solid: '#eab308', light: '#eab30826' },
    { solid: '#ec4899', light: '#ec489926' },
    { solid: '#14b8a6', light: '#14b8a626' },
    { solid: '#8b5cf6', light: '#8b5cf626' },
];

@Component({
    selector: 'app-analytics-growth-dashboard',
    standalone: true,
    providers: [AnalyticsGrowthStore],
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        DatePickerModule,
        ButtonModule,
        SkeletonModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: './analytics-growth-dashboard.component.html',
})
export class AnalyticsGrowthDashboardComponent implements OnInit {
    readonly store = inject(AnalyticsGrowthStore);

    dateRange: Date[] = [];

    // ── Charts ──────────────────────────────────────────────────────────────
    revenueGrowthChartData:    any;
    revenueGrowthChartOptions: any;
    centerRankingChartData:    any;
    centerRankingChartOptions: any;
    momGrowthChartData:        any;
    momGrowthChartOptions:     any;

    constructor() {
        // Rebuild charts whenever data changes
        effect(() => {
            const d = this.store.data();
            if (d) this.buildCharts(d);
        });

        // Sync date range from store filter
        effect(() => {
            const f = this.store.filter();
            if (f.dateFrom && f.dateTo) {
                this.dateRange = [
                    new Date(f.dateFrom + 'T00:00:00'),
                    new Date(f.dateTo   + 'T00:00:00'),
                ];
            }
        });
    }

    ngOnInit(): void { this.dispatchLoad(); }

    applyFilter(): void { this.dispatchLoad(); }

    clearFilter(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange   = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.clearError();
        this.dispatchLoad();
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    trendSeverity(trend: RevenueTrend): 'success' | 'danger' | 'secondary' {
        return trend === 'UP' ? 'success' : trend === 'DOWN' ? 'danger' : 'secondary';
    }

    trendIcon(trend: RevenueTrend): string {
        return trend === 'UP' ? 'pi pi-arrow-up' : trend === 'DOWN' ? 'pi pi-arrow-down' : 'pi pi-minus';
    }

    growthSeverity(rate: number): 'success' | 'danger' | 'secondary' {
        return rate > 0 ? 'success' : rate < 0 ? 'danger' : 'secondary';
    }

    formatMoney(value: number, currency = 'AOA'): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency', currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value ?? 0);
    }

    formatMoneyShort(value: number): string {
        if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
        if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000)         return `${(value / 1_000).toFixed(0)}K`;
        return String(Math.round(value));
    }

    formatGrowth(rate: number | undefined): string {
        if (rate == null) return '—';
        const sign = rate > 0 ? '+' : '';
        return `${sign}${rate.toFixed(1)}%`;
    }

    monthLabel(name: string): string {
        return MONTH_PT[name] ?? name;
    }

    colorFor(index: number): string {
        return CENTER_COLORS[index % CENTER_COLORS.length].solid;
    }

    // ── Private ─────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: AnalyticsGrowthFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:   this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
        };
        this.store.load(filter);
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    private buildCharts(d: AnalyticsGrowth): void {
        const s         = getComputedStyle(document.documentElement);
        const text      = s.getPropertyValue('--text-color').trim()           || '#495057';
        const textMuted = s.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border    = s.getPropertyValue('--surface-border').trim()       || '#dee2e6';

        const labels = d.monthlyGrowth.map((m) => this.monthLabel(m.monthName));

        // ── 1. Barras: receita e cobranças mensais ──────────────────────────
        this.revenueGrowthChartData = {
            labels,
            datasets: [
                {
                    label:           'Receita',
                    data:            d.monthlyGrowth.map((m) => m.revenue),
                    backgroundColor: '#6366f1cc',
                    borderColor:     '#6366f1',
                    borderWidth:     1,
                    borderRadius:    4,
                },
                {
                    label:           'Cobrado',
                    data:            d.monthlyGrowth.map((m) => m.collected),
                    backgroundColor: '#22c55ecc',
                    borderColor:     '#22c55e',
                    borderWidth:     1,
                    borderRadius:    4,
                },
            ],
        };

        this.revenueGrowthChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top', align: 'end',
                    labels: { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: { ticks: { color: text, font: { weight: '500' } }, grid: { display: false }, border: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: textMuted, callback: (v: number) => this.formatMoneyShort(v) },
                    grid: { color: border }, border: { display: false },
                },
            },
        };

        // ── 2. Linha: taxa de crescimento MoM ──────────────────────────────
        const momItems = d.monthlyGrowth.filter((m) => m.revenueGrowthRate != null);
        const momLabels = momItems.map((m) => this.monthLabel(m.monthName));
        const momRates  = momItems.map((m) => m.revenueGrowthRate!);

        this.momGrowthChartData = {
            labels: momLabels,
            datasets: [{
                label:                'Crescimento MoM (%)',
                data:                 momRates,
                borderColor:          '#6366f1',
                backgroundColor:      '#6366f126',
                pointBackgroundColor: momRates.map((r) => (r >= 0 ? '#22c55e' : '#ef4444')),
                pointBorderColor:     '#fff',
                pointBorderWidth:     2,
                pointRadius:          6,
                pointHoverRadius:     8,
                borderWidth:          2.5,
                tension:              0.4,
                fill:                 true,
            }],
        };

        this.momGrowthChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top', align: 'end',
                    labels: { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${this.formatGrowth(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: { ticks: { color: text, font: { weight: '500' } }, grid: { display: false }, border: { display: false } },
                y: {
                    ticks: { color: textMuted, callback: (v: number) => `${v.toFixed(1)}%` },
                    grid: { color: border }, border: { display: false },
                },
            },
        };

        // ── 3. Barras horizontais: ranking de centros ───────────────────────
        const ranking = [...d.centerGrowthRanking].sort((a, b) => b.currentPeriodRevenue - a.currentPeriodRevenue);

        this.centerRankingChartData = {
            labels: ranking.map((c) => `${c.ranking}. ${c.centerName}`),
            datasets: [
                {
                    label:           'Receita Actual',
                    data:            ranking.map((c) => c.currentPeriodRevenue),
                    backgroundColor: ranking.map((_, i) => CENTER_COLORS[i % CENTER_COLORS.length].solid + 'cc'),
                    borderColor:     ranking.map((_, i) => CENTER_COLORS[i % CENTER_COLORS.length].solid),
                    borderWidth:     2,
                    borderRadius:    6,
                    borderSkipped:   false,
                },
                {
                    label:           'Receita Anterior',
                    data:            ranking.map((c) => c.previousPeriodRevenue),
                    backgroundColor: '#94a3b8aa',
                    borderColor:     '#94a3b8',
                    borderWidth:     2,
                    borderRadius:    6,
                    borderSkipped:   false,
                },
            ],
        };

        this.centerRankingChartOptions = {
            indexAxis:           'y',
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top', align: 'end',
                    labels: { color: text, usePointStyle: true, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.x)}`,
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: textMuted, callback: (v: number) => this.formatMoneyShort(v) },
                    grid: { color: border }, border: { display: false },
                },
                y: {
                    ticks: { color: text, font: { weight: '600', size: 13 } },
                    grid: { display: false }, border: { display: false },
                },
            },
        };
    }
}
