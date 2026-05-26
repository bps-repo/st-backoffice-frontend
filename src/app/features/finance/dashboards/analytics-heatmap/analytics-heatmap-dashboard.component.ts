import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AnalyticsHeatmapStore } from './analytics-heatmap.store';
import { AnalyticsHeatmapFilter, AnalyticsHeatmapRow } from 'src/app/core/models/finance/analytics-heatmap.model';

const MONTH_PT: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH:     'Mar', APRIL:    'Abr',
    MAY:     'Mai', JUNE:     'Jun', JULY:       'Jul', AUGUST:   'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

@Component({
    selector: 'app-analytics-heatmap-dashboard',
    standalone: true,
    providers: [AnalyticsHeatmapStore],
    imports: [
        CommonModule,
        FormsModule,
        DatePickerModule,
        InputNumberModule,
        ButtonModule,
        SkeletonModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: './analytics-heatmap-dashboard.component.html',
    styles: [`
        .heatmap-cell {
            width: 100%;
            height: 100%;
            min-height: 3.5rem;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            cursor: default;
            transition: filter 0.15s;
        }
        .heatmap-cell:hover { filter: brightness(0.9); }
        .heatmap-cell.empty {
            background: var(--surface-ground, #f8f9fa);
            border: 1px dashed var(--surface-border, #dee2e6);
        }
    `],
})
export class AnalyticsHeatmapDashboardComponent implements OnInit {
    readonly store = inject(AnalyticsHeatmapStore);

    dateRange: Date[]    = [];
    selectedYear: number = new Date().getFullYear();

    // Rows sorted descending by total — derived from store signal
    readonly sortedRows = computed(() =>
        [...(this.store.data()?.rows ?? [])].sort((a, b) => b.yearTotal - a.yearTotal),
    );

    ngOnInit(): void { this.dispatchLoad(); }

    applyFilter(): void { this.dispatchLoad(); }

    clearFilter(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange   = [oneYearAgo, today];
        this.selectedYear = today.getFullYear();
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.clearError();
        this.dispatchLoad();
    }

    // ── Cell rendering ────────────────────────────────────────────────────

    cellBg(value: number | null, row: AnalyticsHeatmapRow, index: number): string {
        if (value == null) return '';
        const max       = this.store.maxRevenue();
        const intensity = max > 0 ? value / max : 0;
        const alpha     = Math.round(15 + intensity * 200);
        if (index === row.bestMonthIndex)  return `rgba(34,197,94,${alpha / 255})`;
        if (index === row.worstMonthIndex) return `rgba(239,68,68,${alpha / 255})`;
        return `rgba(99,102,241,${alpha / 255})`;
    }

    cellTextColor(value: number | null, row: AnalyticsHeatmapRow, index: number): string {
        if (value == null) return '';
        const max       = this.store.maxRevenue();
        const intensity = max > 0 ? value / max : 0;
        return intensity > 0.6 ? '#fff' : 'var(--text-color,#495057)';
    }

    tooltipText(value: number | null, monthLabel: string, row: AnalyticsHeatmapRow, index: number): string {
        if (value == null) return `${monthLabel}: sem dados`;
        const parts = [`${monthLabel}: ${this.formatMoney(value)}`];
        if (index === row.bestMonthIndex)  parts.push('🏆 Melhor mês');
        if (index === row.worstMonthIndex) parts.push('📉 Pior mês');
        return parts.join(' · ');
    }

    // ── Helpers ──────────────────────────────────────────────────────────

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

    countWithData(arr: (number | null)[]): number {
        return arr.filter((v): v is number => v != null).length;
    }

    // ── Private ──────────────────────────────────────────────────────────

    private dispatchLoad(): void {
        const today      = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const filter: AnalyticsHeatmapFilter = {
            dateFrom:  this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo:    this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            year:      this.selectedYear,
        };
        this.store.load(filter);
    }

    private toISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}
