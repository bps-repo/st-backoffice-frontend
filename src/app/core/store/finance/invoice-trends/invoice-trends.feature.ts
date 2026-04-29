import { createFeature, createReducer, on } from '@ngrx/store';
import { InvoiceTrendsActions, INVOICE_TRENDS_FEATURE_KEY } from './invoice-trends.actions';
import { initialInvoiceTrendsState } from './invoice-trends.state';

export const invoiceTrendsFeature = createFeature({
    name: INVOICE_TRENDS_FEATURE_KEY,
    reducer: createReducer(
        initialInvoiceTrendsState,

        on(InvoiceTrendsActions.loadTrends, (state, { filter }) => ({
            ...state,
            loading: true,
            error: null,
            filter,
        })),

        on(InvoiceTrendsActions.loadTrendsSuccess, (state, { trends }) => ({
            ...state,
            loading: false,
            error: null,
            trends,
        })),

        on(InvoiceTrendsActions.loadTrendsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(InvoiceTrendsActions.setFilter, (state, { filter }) => ({
            ...state,
            filter,
        })),

        on(InvoiceTrendsActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
