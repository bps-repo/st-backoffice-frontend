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
import { InvoiceTrendsActions } from '../../../../core/store/finance/invoice-trends/invoice-trends.actions';
import {
    selectInvoiceTrends,
    selectInvoiceTrendsError,
    selectInvoiceTrendsFilter,
    selectInvoiceTrendsLoading,
} from '../../../../core/store/finance/invoice-trends/invoice-trends.selectors';
import { InvoiceTrends } from '../../../../core/models/finance/invoice-trends.model';

const MONTH_LABELS: Record<string, string> = {
    JANUARY: 'Jan', FEBRUARY: 'Fev', MARCH: 'Mar', APRIL: 'Abr',
    MAY: 'Mai', JUNE: 'Jun', JULY: 'Jul', AUGUST: 'Ago',
    SEPTEMBER: 'Set', OCTOBER: 'Out', NOVEMBER: 'Nov', DECEMBER: 'Dez',
};

@Component({
    selector: 'app-students-materials-dashboard',
    standalone: true,
    imports: [ChartModule, CommonModule, FormsModule, CalendarModule, ButtonModule, SkeletonModule],
    templateUrl: './invoices-dashboard.component.html',
})
export class InvoicesDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    /** NgRx — `selectInvoiceTrendsLoading` */
    readonly loading$: Observable<boolean> = this.store
        .select(selectInvoiceTrendsLoading)
        .pipe(distinctUntilChanged());

    trends: InvoiceTrends | null = null;
    error: string | null = null;
    dateRange: Date[] = [];

    barChartData: any;
    barChartOptions: any;

    constructor() {
        this.store.select(selectInvoiceTrends)
            .pipe(takeUntilDestroyed())
            .subscribe((trends) => {
                this.trends = trends;
                if (trends) this.buildChart(trends);
            });

        this.store.select(selectInvoiceTrendsError)
            .pipe(takeUntilDestroyed())
            .subscribe((error) => (this.error = error ? 'Não foi possível carregar as tendências de faturas.' : null));

        this.store.select(selectInvoiceTrendsFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                const from = new Date(filter.dateFrom + 'T00:00:00');
                const to = new Date(filter.dateTo + 'T00:00:00');
                this.dateRange = [from, to];
            });
    }

    ngOnInit(): void {
        this.dispatchLoad();
    }

    applyFilter(): void {
        this.dispatchLoad();
    }

    clearFilter(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(InvoiceTrendsActions.clearError());
        this.dispatchLoad();
    }

    private dispatchLoad(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        this.store.dispatch(
            InvoiceTrendsActions.loadTrends({
                filter: {
                    dateFrom: this.dateRange?.[0]
                        ? this.toISODate(this.dateRange[0])
                        : this.toISODate(oneYearAgo),
                    dateTo: this.dateRange?.[1]
                        ? this.toISODate(this.dateRange[1])
                        : this.toISODate(today),
                },
            }),
        );
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private buildChart(trends: InvoiceTrends): void {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-color');
        const borderColor = style.getPropertyValue('--surface-border');

        const colors = [
            style.getPropertyValue('--primary-500'),
            style.getPropertyValue('--green-400'),
        ];

        this.barChartData = {
            labels: trends.labels.map((m) => MONTH_LABELS[m] ?? m),
            datasets: trends.datasets.map((ds, i) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: colors[i] ?? style.getPropertyValue('--primary-300'),
                borderRadius: 4,
            })),
        };

        this.barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, usePointStyle: true, padding: 16 },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) =>
                            ` ${ctx.dataset.label}: ${new Intl.NumberFormat('pt-AO', {
                                style: 'currency',
                                currency: 'AOA',
                                minimumFractionDigits: 2,
                            }).format(ctx.parsed.y)}`,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: borderColor },
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: borderColor },
                },
            },
        };
    }
}
