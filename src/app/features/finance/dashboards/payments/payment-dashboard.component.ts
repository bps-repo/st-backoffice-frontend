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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
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
    JANUARY: 'Jan',
    FEBRUARY: 'Fev',
    MARCH: 'Mar',
    APRIL: 'Abr',
    MAY: 'Mai',
    JUNE: 'Jun',
    JULY: 'Jul',
    AUGUST: 'Ago',
    SEPTEMBER: 'Set',
    OCTOBER: 'Out',
    NOVEMBER: 'Nov',
    DECEMBER: 'Dez',
};

@Component({
    selector: 'app-payment-dashboard',
    templateUrl: './payment-dashboard.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        CalendarModule,
        DropdownModule,
        ButtonModule,
        SkeletonModule,
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

    /** Empty string = todos os centros. */
    selectedCenterId = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    paymentDistributionData: any;
    paymentDistributionOptions: any;
    paymentTrendsData: any;
    paymentTrendsOptions: any;

    constructor() {
        this.store.select(selectFinancePaymentDashboardSummary).pipe(takeUntilDestroyed()).subscribe((s) => {
            this.summary = s;
            if (s) this.initDistributionChart(s);
        });

        this.store.select(selectFinancePaymentDashboardTrends).pipe(takeUntilDestroyed()).subscribe((t) => {
            if (t) this.initTrendsChart(t);
        });

        this.store
            .select(selectFinancePaymentDashboardError)
            .pipe(takeUntilDestroyed())
            .subscribe((err) => (this.error = err ? 'Não foi possível carregar o resumo de pagamentos.' : null));

        this.store
            .select(selectFinancePaymentDashboardFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                this.selectedCenterId = filter.centerId ?? '';
                const from = new Date(filter.dateFrom + 'T00:00:00');
                const to = new Date(filter.dateTo + 'T00:00:00');
                this.dateRange = [from, to];
            });
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.dispatchLoad();
    }

    applyFilter(): void {
        this.dispatchLoad();
    }

    clearFilter(): void {
        this.selectedCenterId = '';
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(FinancePaymentDashboardActions.clearError());
        this.dispatchLoad();
    }

    private dispatchLoad(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        const filter: PaymentDashboardFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo: this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
        };

        this.store.dispatch(FinancePaymentDashboardActions.load({ filter }));
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private initDistributionChart(s: PaymentSummary): void {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-color');

        this.paymentDistributionData = {
            labels: ['Pagos', 'Pendentes', 'Em atraso'],
            datasets: [
                {
                    data: [s.totalPaid, s.pendingAmount, s.overdueAmount],
                    backgroundColor: [
                        style.getPropertyValue('--green-500'),
                        style.getPropertyValue('--yellow-500'),
                        style.getPropertyValue('--red-500'),
                    ],
                    hoverBackgroundColor: [
                        style.getPropertyValue('--green-400'),
                        style.getPropertyValue('--yellow-400'),
                        style.getPropertyValue('--red-400'),
                    ],
                },
            ],
        };

        this.paymentDistributionOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: { weight: 600 },
                        padding: 16,
                    },
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição de valores',
                    font: { size: 14 },
                    color: textColor,
                },
            },
            cutout: '60%',
        };
    }

    private initTrendsChart(trends: PaymentTrends): void {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-color');
        const borderColor = style.getPropertyValue('--surface-border');

        const palette = [style.getPropertyValue('--primary-500'), style.getPropertyValue('--orange-400')];

        this.paymentTrendsData = {
            labels: trends.labels.map((m) => MONTH_LABELS[m] ?? m),
            datasets: trends.datasets.map((ds, i) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: palette[i % palette.length],
                borderRadius: 4,
            })),
        };

        this.paymentTrendsOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, font: { weight: 500 } },
                },
                title: {
                    display: true,
                    text: 'Tendências de pagamentos',
                    font: { size: 14 },
                    color: textColor,
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

    formatMoney(value: number, currency: string): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(value);
    }
}
