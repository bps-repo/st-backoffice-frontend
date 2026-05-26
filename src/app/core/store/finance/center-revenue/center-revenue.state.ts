import { CenterRevenue, CenterRevenueFilter } from 'src/app/core/models/finance/center-revenue.model';

export interface CenterRevenueState {
    data: CenterRevenue[];
    loading: boolean;
    error: unknown;
    filter: CenterRevenueFilter;
}

function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const today      = new Date();
const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

export const initialCenterRevenueState: CenterRevenueState = {
    data:    [],
    loading: false,
    error:   null,
    filter:  {
        dateFrom: toISODate(oneYearAgo),
        dateTo:   toISODate(today),
    },
};
