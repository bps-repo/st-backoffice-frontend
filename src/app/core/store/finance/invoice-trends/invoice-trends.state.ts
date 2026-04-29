import { InvoiceTrends, InvoiceTrendsFilter } from 'src/app/core/models/finance/invoice-trends.model';

export interface InvoiceTrendsState {
    trends: InvoiceTrends | null;
    loading: boolean;
    error: any;
    filter: InvoiceTrendsFilter;
}

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

const today = new Date();
const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

export const initialInvoiceTrendsState: InvoiceTrendsState = {
    trends: null,
    loading: false,
    error: null,
    filter: {
        dateFrom: toISODate(oneYearAgo),
        dateTo: toISODate(today),
    },
};
