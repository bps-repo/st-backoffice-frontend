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
import { SellerEvolutionActions } from 'src/app/core/store/finance/seller-evolution/seller-evolution.actions';
import {
    selectSellerEvolutionError,
    selectSellerEvolutionFilter,
    selectSellerEvolutionLoading,
    selectSellerEvolutionSellers,
} from 'src/app/core/store/finance/seller-evolution/seller-evolution.selectors';
import { SellerEvolution, SellerEvolutionFilter } from 'src/app/core/models/finance/seller-evolution.model';

// Paleta de cores por consultor (até 8)
const SELLER_COLORS = [
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
    selector: 'app-seller-evolution-dashboard',
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
    templateUrl: './seller-evolution-dashboard.component.html',
})
export class SellerEvolutionDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    readonly loading$: Observable<boolean> = this.store
        .select(selectSellerEvolutionLoading)
        .pipe(distinctUntilChanged());

    sellers: SellerEvolution[] = [];
    error: string | null       = null;
    dateRange: Date[]          = [];
    selectedCenterId           = '';
    selectedSellerId           = '';

    /** Opções de centro (from store) */
    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    /** Opções de consultor (derivadas dos dados carregados) */
    get sellerOptions(): SelectItem[] {
        const opts: SelectItem[] = [{ label: 'Todos os consultores', value: '' }];
        this.sellers.forEach((s) => opts.push({ label: `${s.sellerName} — ${s.centerName}`, value: s.sellerId }));
        return opts;
    }

    /** Vista activa: undefined = todos, string = sellerId seleccionado */
    get activeSeller(): SellerEvolution | undefined {
        return this.selectedSellerId
            ? this.sellers.find((s) => s.sellerId === this.selectedSellerId)
            : undefined;
    }

    get isDetailView(): boolean { return !!this.selectedSellerId; }

    // ── Charts — visão geral (todos os consultores) ────────────────────────
    revenueEvolutionChartData: any;
    revenueEvolutionChartOptions: any;

    collectedEvolutionChartData: any;
    collectedEvolutionChartOptions: any;

    contractsChartData: any;
    contractsChartOptions: any;

    // ── Charts — visão individual (um consultor) ───────────────────────────
    detailRevenueChartData: any;
    detailRevenueChartOptions: any;

    detailContractsChartData: any;
    detailContractsChartOptions: any;

    constructor() {
        this.store.select(selectSellerEvolutionSellers)
            .pipe(takeUntilDestroyed())
            .subscribe((s) => {
                this.sellers = s ?? [];
                this.buildCharts();
            });

        this.store.select(selectSellerEvolutionError)
            .pipe(takeUntilDestroyed())
            .subscribe((err) => (this.error = err ? 'Não foi possível carregar a evolução de consultores.' : null));

        this.store.select(selectSellerEvolutionFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                this.selectedCenterId = filter.centerId ?? '';
                this.selectedSellerId = filter.sellerId  ?? '';
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
        this.selectedSellerId = '';
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange   = [oneYearAgo, today];
        this.dispatchLoad();
    }

    onSellerChange(): void {
        // Se mudar de consultor, recarrega imediatamente
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(SellerEvolutionActions.clearError());
        this.dispatchLoad();
    }

    // ── Computed ──────────────────────────────────────────────────────────────

    get topSeller(): SellerEvolution | undefined {
        return this.sellers.find((s) => s.overallRanking === 1);
    }

    get totalRevenue(): number {
        return this.sellers.reduce((acc, s) => acc + s.totalRevenue, 0);
    }

    get totalCollected(): number {
        return this.sellers.reduce((acc, s) => acc + s.totalCollected, 0);
    }

    get totalContracts(): number {
        return this.sellers.reduce((acc, s) => acc + s.totalContracts, 0);
    }

    get avgCollectionRate(): number {
        if (!this.sellers.length) return 0;
        return this.sellers.reduce((acc, s) => acc + s.collectionRate, 0) / this.sellers.length;
    }

    colorFor(index: number): string {
        return SELLER_COLORS[index % SELLER_COLORS.length].solid;
    }

    rankIcon(ranking: number): string {
        if (ranking === 1) return 'pi pi-star-fill text-yellow-400';
        if (ranking === 2) return 'pi pi-star-fill text-blue-300';
        if (ranking === 3) return 'pi pi-star-fill text-orange-400';
        return 'pi pi-user text-color-secondary';
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

    // ── Private ───────────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: SellerEvolutionFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:   this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
            ...(this.selectedSellerId ? { sellerId:  this.selectedSellerId  } : {}),
        };
        this.store.dispatch(SellerEvolutionActions.load({ filter }));
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    private buildCharts(): void {
        if (!this.sellers.length) return;

        const s         = getComputedStyle(document.documentElement);
        const text      = s.getPropertyValue('--text-color').trim()           || '#495057';
        const textMuted = s.getPropertyValue('--text-color-secondary').trim() || '#6c757d';
        const border    = s.getPropertyValue('--surface-border').trim()       || '#dee2e6';

        // Eixo X unificado com todos os meses presentes
        const monthKeys = new Set<string>();
        this.sellers.forEach((sel) =>
            sel.monthlyData.forEach((m) => monthKeys.add(`${m.year}-${String(m.month).padStart(2, '0')}`)),
        );
        const sortedKeys  = Array.from(monthKeys).sort();
        const monthNames  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        const monthLabels = sortedKeys.map((k) => {
            const mo = parseInt(k.split('-')[1], 10);
            return monthNames[mo - 1] ?? k;
        });

        const getField = (seller: SellerEvolution, field: 'revenue' | 'collected' | 'pending'): number[] =>
            sortedKeys.map((key) => {
                const [yr, mo] = key.split('-').map(Number);
                return seller.monthlyData.find((m) => m.year === yr && m.month === mo)?.[field] ?? 0;
            });

        const getContracts = (seller: SellerEvolution): number[] =>
            sortedKeys.map((key) => {
                const [yr, mo] = key.split('-').map(Number);
                return seller.monthlyData.find((m) => m.year === yr && m.month === mo)?.contractsSigned ?? 0;
            });

        const tooltipMoney = (ctx: any) =>
            ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y ?? ctx.parsed.x ?? 0)}`;

        // ── 1. Linha: Receita por consultor ao longo dos meses ────────────────
        this.revenueEvolutionChartData = {
            labels: monthLabels,
            datasets: this.sellers.map((sel, i) => {
                const c = SELLER_COLORS[i % SELLER_COLORS.length];
                return {
                    label:                sel.sellerName,
                    data:                 getField(sel, 'revenue'),
                    borderColor:          c.solid,
                    backgroundColor:      c.light,
                    pointBackgroundColor: c.solid,
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

        this.revenueEvolutionChartOptions = this.lineOptions(text, textMuted, border, tooltipMoney);

        // ── 2. Linha: Cobranças por consultor ─────────────────────────────────
        this.collectedEvolutionChartData = {
            labels: monthLabels,
            datasets: this.sellers.map((sel, i) => {
                const c = SELLER_COLORS[i % SELLER_COLORS.length];
                return {
                    label:                sel.sellerName,
                    data:                 getField(sel, 'collected'),
                    borderColor:          c.solid,
                    backgroundColor:      c.light,
                    pointBackgroundColor: c.solid,
                    pointBorderColor:     '#fff',
                    pointBorderWidth:     2,
                    pointRadius:          5,
                    pointHoverRadius:     7,
                    borderWidth:          2.5,
                    tension:              0.4,
                    fill:                 false,
                };
            }),
        };

        this.collectedEvolutionChartOptions = this.lineOptions(text, textMuted, border, tooltipMoney);

        // ── 3. Barras agrupadas: contratos por mês por consultor ──────────────
        this.contractsChartData = {
            labels: monthLabels,
            datasets: this.sellers.map((sel, i) => {
                const c = SELLER_COLORS[i % SELLER_COLORS.length];
                return {
                    label:           sel.sellerName,
                    data:            getContracts(sel),
                    backgroundColor: c.solid + 'cc',
                    borderColor:     c.solid,
                    borderWidth:     1,
                    borderRadius:    4,
                };
            }),
        };

        this.contractsChartOptions = {
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
                        label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y} contrato(s)`,
                    },
                },
            },
            scales: {
                x: { ticks: { color: text, font: { weight: '500' } }, grid: { display: false }, border: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: textMuted, stepSize: 1 },
                    grid:  { color: border },
                    border: { display: false },
                },
            },
        };

        // ── Gráficos do detalhe individual ────────────────────────────────────
        const detail = this.activeSeller ?? this.sellers[0];
        if (detail) this.buildDetailCharts(detail, monthLabels, sortedKeys, text, textMuted, border);
    }

    private buildDetailCharts(
        detail: SellerEvolution,
        monthLabels: string[],
        sortedKeys: string[],
        text: string, textMuted: string, border: string,
    ): void {
        const green  = '#22c55e';
        const yellow = '#eab308';
        const blue   = '#3b82f6';

        const getField = (field: 'revenue' | 'collected' | 'pending'): number[] =>
            sortedKeys.map((key) => {
                const [yr, mo] = key.split('-').map(Number);
                return detail.monthlyData.find((m) => m.year === yr && m.month === mo)?.[field] ?? 0;
            });

        const getContracts = (): number[] =>
            sortedKeys.map((key) => {
                const [yr, mo] = key.split('-').map(Number);
                return detail.monthlyData.find((m) => m.year === yr && m.month === mo)?.contractsSigned ?? 0;
            });

        // Linha: receita vs cobrado vs pendente (individual)
        this.detailRevenueChartData = {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Receita', data: getField('revenue'),
                    borderColor: blue,   backgroundColor: blue   + '26',
                    pointBackgroundColor: blue,   pointBorderColor: '#fff', pointBorderWidth: 2,
                    pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5, tension: 0.4, fill: false,
                },
                {
                    label: 'Cobrado', data: getField('collected'),
                    borderColor: green,  backgroundColor: green  + '26',
                    pointBackgroundColor: green,  pointBorderColor: '#fff', pointBorderWidth: 2,
                    pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5, tension: 0.4, fill: true,
                },
                {
                    label: 'Pendente', data: getField('pending'),
                    borderColor: yellow, backgroundColor: yellow + '26',
                    pointBackgroundColor: yellow, pointBorderColor: '#fff', pointBorderWidth: 2,
                    pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5, tension: 0.4, fill: false,
                },
            ],
        };

        this.detailRevenueChartOptions = this.lineOptions(
            text, textMuted, border,
            (ctx: any) => ` ${ctx.dataset.label}: ${this.formatMoney(ctx.parsed.y ?? 0)}`,
        );

        // Barras: contratos por mês (individual)
        this.detailContractsChartData = {
            labels: monthLabels,
            datasets: [{
                label:           'Contratos Assinados',
                data:            getContracts(),
                backgroundColor: blue + 'cc',
                borderColor:     blue,
                borderWidth:     2,
                borderRadius:    6,
                borderSkipped:   false,
            }],
        };

        this.detailContractsChartOptions = {
            responsive:          true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} contrato(s)` },
                },
            },
            scales: {
                x: { ticks: { color: text, font: { weight: '500' } }, grid: { display: false }, border: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: textMuted, stepSize: 1 },
                    grid: { color: border },
                    border: { display: false },
                },
            },
        };
    }

    private lineOptions(
        text: string, textMuted: string, border: string,
        tooltipLabel: (ctx: any) => string,
    ): any {
        return {
            responsive:          true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top', align: 'end',
                    labels: { color: text, usePointStyle: true, pointStyleWidth: 10, padding: 16 },
                },
                tooltip: { callbacks: { label: tooltipLabel } },
            },
            scales: {
                x: { ticks: { color: text, font: { weight: '500' } }, grid: { display: false }, border: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: textMuted, callback: (v: number) => this.formatMoneyShort(v) },
                    grid: { color: border },
                    border: { display: false },
                },
            },
        };
    }
}
