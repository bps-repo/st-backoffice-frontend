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
import { TooltipModule } from 'primeng/tooltip';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { CenterRevenueActions } from 'src/app/core/store/finance/center-revenue/center-revenue.actions';
import {
    selectCenterRevenueData,
    selectCenterRevenueError,
    selectCenterRevenueFilter,
    selectCenterRevenueLoading,
} from 'src/app/core/store/finance/center-revenue/center-revenue.selectors';
import { CenterRevenue, CenterRevenueFilter } from 'src/app/core/models/finance/center-revenue.model';

const MONTH_PT: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH:     'Mar', APRIL:    'Abr',
    MAY:     'Mai', JUNE:     'Jun', JULY:       'Jul', AUGUST:   'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

// Paleta de cores por centro (até 8 centros)
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
    selector: 'app-center-revenue-dashboard',
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
        TooltipModule,
    ],
    templateUrl: './center-revenue-dashboard.component.html',
})
export class CenterRevenueDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    readonly loading$: Observable<boolean> = this.store
        .select(selectCenterRevenueLoading)
        .pipe(distinctUntilChanged());

    data: CenterRevenue[] = [];
    error: string | null  = null;
    dateRange: Date[]     = [];
    selectedCenterId      = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    // ── Charts ────────────────────────────────────────────────────────────────
    /** Gráfico de barras empilhadas: receita mensal por centro */
    revenueByMonthChartData: any;
    revenueByMonthChartOptions: any;

    /** Gráfico de linha: crescimento de cobranças por centro ao longo do tempo */
    growthChartData: any;
    growthChartOptions: any;

    /** Gráfico horizontal: comparação de receita total por centro */
    centerCompareChartData: any;
    centerCompareChartOptions: any;

    constructor() {
        this.store.select(selectCenterRevenueData)
            .pipe(takeUntilDestroyed())
            .subscribe((d) => {
                this.data = d ?? [];
                if (d?.length) this.buildCharts(d);
            });

        this.store.select(selectCenterRevenueError)
            .pipe(takeUntilDestroyed())
            .subscribe((err) => (this.error = err ? 'Não foi possível carregar a receita por centro.' : null));

        this.store.select(selectCenterRevenueFilter)
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

    applyFilter(): void { this.dispatchLoad(); }

    clearFilter(): void {
        this.selectedCenterId = '';
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange   = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(CenterRevenueActions.clearError());
        this.dispatchLoad();
    }

    // ── Computed ──────────────────────────────────────────────────────────────

    get totalRevenue(): number {
        return this.data.reduce((s, c) => s + c.totalRevenue, 0);
    }

    get totalCollected(): number {
        return this.data.reduce((s, c) => s + c.totalCollected, 0);
    }

    get totalPending(): number {
        return this.data.reduce((s, c) => s + c.totalPending, 0);
    }

    get avgCollectionRate(): number {
        if (!this.data.length) return 0;
        return this.data.reduce((s, c) => s + c.collectionRate, 0) / this.data.length;
    }

    // ── Format helpers ────────────────────────────────────────────────────────

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

    colorFor(index: number): string {
        return CENTER_COLORS[index % CENTER_COLORS.length].solid;
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: CenterRevenueFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:   this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
        };
        this.store.dispatch(CenterRevenueActions.load({ filter }));
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    private buildCharts(centers: CenterRevenue[]): void {
        const s         = getComputedStyle(document.documentElement);
        const text      = s.getPropertyValue('--text-color').trim()           || '#495057';
        const textMuted = s.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border    = s.getPropertyValue('--surface-border').trim()       || '#dee2e6';

        // ── Montar eixo X unificado (todos os meses presentes nos dados) ──────
        const monthKeys = new Set<string>();
        centers.forEach((c) =>
            c.monthlyData.forEach((m) => monthKeys.add(`${m.year}-${String(m.month).padStart(2, '0')}`)),
        );
        const sortedKeys   = Array.from(monthKeys).sort();
        const monthLabels  = sortedKeys.map((k) => {
            const [, mo] = k.split('-');
            const names  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
            return names[parseInt(mo, 10) - 1] ?? k;
        });

        // ── Mapear dados por centro e mês ─────────────────────────────────────
        const getValues = (center: CenterRevenue, field: 'revenue' | 'collected' | 'pending'): number[] =>
            sortedKeys.map((key) => {
                const [yr, mo] = key.split('-').map(Number);
                return center.monthlyData.find((m) => m.year === yr && m.month === mo)?.[field] ?? 0;
            });

        // ── 1. Barras empilhadas — receita mensal por centro ──────────────────
        this.revenueByMonthChartData = {
            labels: monthLabels,
            datasets: centers.map((c, i) => {
                const col = CENTER_COLORS[i % CENTER_COLORS.length];
                return {
                    label:           c.centerName,
                    data:            getValues(c, 'revenue'),
                    backgroundColor: col.solid + 'cc',
                    borderColor:     col.solid,
                    borderWidth:     1,
                    borderRadius:    4,
                };
            }),
        };

        this.revenueByMonthChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align:    'end',
                    labels:   { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y)}`,
                        footer: (items: any[]) => {
                            const total = items.reduce((s, i) => s + i.parsed.y, 0);
                            return `Total: ${this.formatMoney(total)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks:   { color: text,      font: { weight: '500' } },
                    grid:    { display: false },
                    border:  { display: false },
                },
                y: {
                    stacked:     true,
                    beginAtZero: true,
                    ticks: {
                        color:    textMuted,
                        callback: (v: number) => this.formatMoneyShort(v),
                    },
                    grid:   { color: border },
                    border: { display: false },
                },
            },
        };

        // ── 2. Linha — crescimento de cobranças por centro ────────────────────
        this.growthChartData = {
            labels: monthLabels,
            datasets: centers.map((c, i) => {
                const col = CENTER_COLORS[i % CENTER_COLORS.length];
                return {
                    label:                c.centerName,
                    data:                 getValues(c, 'collected'),
                    borderColor:          col.solid,
                    backgroundColor:      col.light,
                    pointBackgroundColor: col.solid,
                    pointBorderColor:     '#fff',
                    pointBorderWidth:     2,
                    pointRadius:          5,
                    pointHoverRadius:     7,
                    borderWidth:          2.5,
                    tension:              0.4,
                    fill:                 true,
                };
            }),
        };

        this.growthChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align:    'end',
                    labels:   { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: {
                    ticks:  { color: text,      font: { weight: '500' } },
                    grid:   { display: false },
                    border: { display: false },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color:    textMuted,
                        callback: (v: number) => this.formatMoneyShort(v),
                    },
                    grid:   { color: border },
                    border: { display: false },
                },
            },
        };

        // ── 3. Barras horizontais — receita total por centro ──────────────────
        this.centerCompareChartData = {
            labels: centers.map((c) => c.centerName),
            datasets: [
                {
                    label:           'Receita Total',
                    data:            centers.map((c) => c.totalRevenue),
                    backgroundColor: centers.map((_, i) => CENTER_COLORS[i % CENTER_COLORS.length].solid + 'cc'),
                    borderColor:     centers.map((_, i) => CENTER_COLORS[i % CENTER_COLORS.length].solid),
                    borderWidth:     2,
                    borderRadius:    6,
                    borderSkipped:   false,
                },
                {
                    label:           'Cobrado',
                    data:            centers.map((c) => c.totalCollected),
                    backgroundColor: '#22c55eaa',
                    borderColor:     '#22c55e',
                    borderWidth:     2,
                    borderRadius:    6,
                    borderSkipped:   false,
                },
            ],
        };

        this.centerCompareChartOptions = {
            indexAxis:           'y',
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align:    'end',
                    labels:   { color: text, usePointStyle: true, padding: 16 },
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
                    ticks: {
                        color:    textMuted,
                        callback: (v: number) => this.formatMoneyShort(v),
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
