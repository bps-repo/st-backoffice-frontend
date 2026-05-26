import { PaymentDashboardFilter, PaymentSummary, PaymentTrends } from 'src/app/core/models/finance/payment-dashboard.model';

export interface FinancePaymentDashboardState {
    summary: PaymentSummary | null;
    trends: PaymentTrends | null;
    loading: boolean;
    error: unknown;
    filter: PaymentDashboardFilter;
}

function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
