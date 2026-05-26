import { InvoiceTrends, InvoiceTrendsFilter } from 'src/app/core/models/finance/invoice-trends.model';

export interface InvoiceTrendsState {
    trends: InvoiceTrends | null;
    loading: boolean;
    error: any;
    filter: InvoiceTrendsFilter;
}

function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
