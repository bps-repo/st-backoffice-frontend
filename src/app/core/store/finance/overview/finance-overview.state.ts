import { FinanceOverview, FinanceOverviewFilter } from 'src/app/core/models/finance/finance-overview.model';

export interface FinanceOverviewState {
    overview: FinanceOverview | null;
    loading: boolean;
    error: any;
    filter: FinanceOverviewFilter;
}

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export const initialFinanceOverviewState: FinanceOverviewState = {
    overview: null,
    loading: false,
    error: null,
    filter: {
        dateFrom: toISODate(firstOfMonth),
        dateTo: toISODate(today),
    },
};
