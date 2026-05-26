import { Injectable, signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, EMPTY, switchMap, tap, catchError } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import {
    AnalyticsHeatmap,
    AnalyticsHeatmapFilter,
} from 'src/app/core/models/finance/analytics-heatmap.model';

function toISODate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultFilter(): AnalyticsHeatmapFilter {
    const today      = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return { dateFrom: toISODate(oneYearAgo), dateTo: toISODate(today), year: today.getFullYear() };
}

/** Signal-based store — provide at component level so it's scoped to the tab. */
@Injectable()
export class AnalyticsHeatmapStore {
    private readonly service = inject(FinanceDashboardService);

    // ── State ──────────────────────────────────────────────────────────────
    readonly data    = signal<AnalyticsHeatmap | null>(null);
    readonly loading = signal(false);
    readonly error   = signal<string | null>(null);
    readonly filter  = signal<AnalyticsHeatmapFilter>(defaultFilter());

    // ── Derived ────────────────────────────────────────────────────────────
    readonly hasData = computed(() => this.data() != null);
    readonly maxRevenue = computed(() => {
        const d = this.data();
        if (!d) return 0;
        return Math.max(
            0,
            ...d.rows.flatMap((r) => r.monthlyRevenue.filter((v): v is number => v != null)),
        );
    });

    // ── Internal trigger ───────────────────────────────────────────────────
    private readonly trigger$ = new Subject<AnalyticsHeatmapFilter>();

    constructor() {
        this.trigger$.pipe(
            switchMap((f) =>
                this.service.getAnalyticsHeatmap(f).pipe(
                    tap(() => this.loading.set(false)),
                    catchError(() => {
                        this.error.set('Não foi possível carregar o heatmap de receita.');
                        this.loading.set(false);
                        return EMPTY;
                    }),
                ),
            ),
            takeUntilDestroyed(),
        ).subscribe((d) => this.data.set(d));
    }

    // ── Public API ─────────────────────────────────────────────────────────
    load(f: AnalyticsHeatmapFilter): void {
        this.loading.set(true);
        this.error.set(null);
        this.filter.set(f);
        this.trigger$.next(f);
    }

    clearError(): void { this.error.set(null); }
}
