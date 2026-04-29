import { PaymentDashboardFilter, PaymentSummary, PaymentTrends } from 'src/app/core/models/finance/payment-dashboard.model';

export interface FinancePaymentDashboardState {
    summary: PaymentSummary | null;
    trends: PaymentTrends | null;
    loading: boolean;
    error: unknown;
    filter: PaymentDashboardFilter;
}

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

const today = new Date();
const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

export const initialFinancePaymentDashboardState: FinancePaymentDashboardState = {
    summary: null,
    trends: null,
    loading: false,
    error: null,
    filter: {
        dateFrom: toISODate(oneYearAgo),
        dateTo: toISODate(today),
    },
};
