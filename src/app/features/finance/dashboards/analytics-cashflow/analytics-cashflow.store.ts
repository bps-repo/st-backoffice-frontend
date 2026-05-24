import { Injectable, signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, EMPTY, switchMap, tap, catchError } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import {
    AnalyticsCashflow,
    AnalyticsCashflowFilter,
} from 'src/app/core/models/finance/analytics-cashflow.model';

function toISODate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultFilter(): AnalyticsCashflowFilter {
    const today      = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    return { dateFrom: toISODate(oneYearAgo), dateTo: toISODate(today) };
}

/** Signal-based store — provide at component level so it's scoped to the tab. */
@Injectable()
export class AnalyticsCashflowStore {
    private readonly service = inject(FinanceDashboardService);

    // ── State ──────────────────────────────────────────────────────────────
    readonly data    = signal<AnalyticsCashflow | null>(null);
    readonly loading = signal(false);
    readonly error   = signal<string | null>(null);
    readonly filter  = signal<AnalyticsCashflowFilter>(defaultFilter());

    // ── Derived ────────────────────────────────────────────────────────────
    readonly hasData        = computed(() => this.data() != null);
    readonly totalInflow    = computed(() => this.data()?.totalInflow ?? 0);
    readonly totalPending   = computed(() => this.data()?.totalPending ?? 0);
    readonly totalOverdue   = computed(() => this.data()?.totalOverdue ?? 0);
    readonly netPosition    = computed(() => this.data()?.netPosition ?? 0);
    readonly avgInflow      = computed(() => this.data()?.averageMonthlyInflow ?? 0);
    readonly bestMonth      = computed(() => this.data()?.bestInflowMonth ?? '—');
    readonly worstMonth     = computed(() => this.data()?.worstInflowMonth ?? '—');
    readonly monthlyData    = computed(() => this.data()?.monthlyData ?? []);

    // ── Internal trigger ───────────────────────────────────────────────────
    private readonly trigger$ = new Subject<AnalyticsCashflowFilter>();

    constructor() {
        this.trigger$.pipe(
            switchMap((f) =>
                this.service.getAnalyticsCashflow(f).pipe(
                    tap(() => this.loading.set(false)),
                    catchError(() => {
                        this.error.set('Não foi possível carregar o fluxo de caixa.');
                        this.loading.set(false);
                        return EMPTY;
                    }),
                ),
            ),
            takeUntilDestroyed(),
        ).subscribe((d) => this.data.set(d));
    }

    // ── Public API ─────────────────────────────────────────────────────────
    load(f: AnalyticsCashflowFilter): void {
        this.loading.set(true);
        this.error.set(null);
        this.filter.set(f);
        this.trigger$.next(f);
    }

    clearError(): void { this.error.set(null); }
}
