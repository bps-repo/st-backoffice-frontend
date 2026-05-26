import { createFeature, createReducer, on } from '@ngrx/store';
import {
    FinancePaymentDashboardActions,
    FINANCE_PAYMENT_DASHBOARD_FEATURE_KEY,
} from './payment-dashboard.actions';
import { initialFinancePaymentDashboardState } from './payment-dashboard.state';

export const financePaymentDashboardFeature = createFeature({
    name: FINANCE_PAYMENT_DASHBOARD_FEATURE_KEY,
    reducer: createReducer(
        initialFinancePaymentDashboardState,

        on(FinancePaymentDashboardActions.load, (state, { filter }) => ({
            ...state,
            loading: true,
            error: null,
            filter,
        })),

        on(FinancePaymentDashboardActions.loadSuccess, (state, { summary, trends }) => ({
            ...state,
            loading: false,
            error: null,
            summary,
            trends,
        })),

        on(FinancePaymentDashboardActions.loadFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(FinancePaymentDashboardActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
