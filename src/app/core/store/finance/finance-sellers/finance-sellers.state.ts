import { FinanceSellerTopRanking, FinanceSellersFilter } from 'src/app/core/models/finance/finance-sellers.model';

export interface FinanceSellersState {
    sellers: FinanceSellerTopRanking[] | null;
    loading: boolean;
    error: unknown;
    filter: FinanceSellersFilter;
}

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

const today = new Date();
const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

export const initialFinanceSellersState: FinanceSellersState = {
    sellers: null,
    loading: false,
    error: null,
    filter: {
        dateFrom: toISODate(oneYearAgo),
        dateTo: toISODate(today),
    },
};
