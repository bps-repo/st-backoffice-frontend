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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
