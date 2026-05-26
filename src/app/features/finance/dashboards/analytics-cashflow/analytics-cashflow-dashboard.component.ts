import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import { AnalyticsCashflowStore } from './analytics-cashflow.store';
import { AnalyticsCashflow, AnalyticsCashflowFilter, AnalyticsCashflowMonthlyItem } from 'src/app/core/models/finance/analytics-cashflow.model';

const MONTH_PT: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH:     'Mar', APRIL:    'Abr',
    MAY:     'Mai', JUNE:     'Jun', JULY:       'Jul', AUGUST:   'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

@Component({
    selector: 'app-analytics-cashflow-dashboard',
    standalone: true,
    providers: [AnalyticsCashflowStore],
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
    templateUrl: './analytics-cashflow-dashboard.component.html',
})
export class AnalyticsCashflowDashboardComponent implements OnInit {
    readonly store     = inject(AnalyticsCashflowStore);
    private readonly ngrxStore = inject(Store);

    dateRange: Date[]    = [];
    selectedCenterId     = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.ngrxStore
        .select(CenterSelectors.selectAllCenters)
        .pipe(map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]));

    // ── Charts ──────────────────────────────────────────────────────────────
    cashflowChartData:    any;
    cashflowChartOptions: any;
    momChartData:         any;
    momChartOptions:      any;

    constructor() {
        effect(() => {
            const d = this.store.data();
            if (d) this.buildCharts(d);
        });
    }

    ngOnInit(): void {
        this.ngrxStore.dispatch(CenterActions.loadCenters());
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
        this.store.clearError();
        this.dispatchLoad();
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    growthSeverity(rate: number | undefined): 'success' | 'danger' | 'secondary' {
        if (rate == null) return 'secondary';
        return rate > 0 ? 'success' : rate < 0 ? 'danger' : 'secondary';
    }

    formatGrowth(rate: number | undefined): string {
        if (rate == null) return '—';
        const sign = rate > 0 ? '+' : '';
        return `${sign}${rate.toFixed(1)}%`;
    }

    formatMoney(value: number, currency = 'AOA'): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency', currency,
            minimumFractionDigits: 0, maximumFractionDigits: 0,
        }).format(value ?? 0);
    }

    formatMoneyShort(value: number): string {
        if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
        if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000)         return `${(value / 1_000).toFixed(0)}K`;
        return String(Math.round(value));
    }

    monthLabel(name: string): string { return MONTH_PT[name] ?? name; }

    // ── Private ─────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: AnalyticsCashflowFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:   this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
        };
        this.store.load(filter);
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    private buildCharts(d: AnalyticsCashflow): void {
        const s         = getComputedStyle(document.documentElement);
        const text      = s.getPropertyValue('--text-color').trim()           || '#495057';
        const textMuted = s.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border    = s.getPropertyValue('--surface-border').trim()       || '#dee2e6';

        const labels  = d.monthlyData.map((m) => this.monthLabel(m.monthName));

        // ── 1. Barras agrupadas: entrada, pendente, vencido, contratos originados ─
        this.cashflowChartData = {
            labels,
            datasets: [
                {
                    label:           'Entradas (Inflow)',
                    data:            d.monthlyData.map((m) => m.inflow),
                    backgroundColor: '#22c55ecc',
                    borderColor:     '#22c55e',
                    borderWidth:     1,
                    borderRadius:    4,
                },
                {
                    label:           'Pendente',
                    data:            d.monthlyData.map((m) => m.pending),
                    backgroundColor: '#eab308cc',
                    borderColor:     '#eab308',
                    borderWidth:     1,
                    borderRadius:    4,
                },
                {
                    label:           'Vencido',
                    data:            d.monthlyData.map((m) => m.overdue),
                    backgroundColor: '#ef4444cc',
                    borderColor:     '#ef4444',
                    borderWidth:     1,
                    borderRadius:    4,
                },
                {
                    label:           'Contratos Originados',
                    data:            d.monthlyData.map((m) => m.contractsOriginated),
                    backgroundColor: '#6366f1cc',
                    borderColor:     '#6366f1',
                    borderWidth:     1,
                    borderRadius:    4,
                },
            ],
        };

        this.cashflowChartOptions = {
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

        // ── 2. Linha + área: net flow e taxa de crescimento MoM ────────────
        const momItems  = d.monthlyData.filter((m) => m.inflowGrowthRate != null);
        const momLabels = momItems.map((m) => this.monthLabel(m.monthName));
        const momRates  = momItems.map((m) => m.inflowGrowthRate!);

        this.momChartData = {
            labels: momLabels,
            datasets: [{
                label:                'Crescimento Inflow MoM (%)',
                data:                 momRates,
                borderColor:          '#22c55e',
                backgroundColor:      '#22c55e26',
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

        this.momChartOptions = {
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
    }
}
