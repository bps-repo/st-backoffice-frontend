import { createFeature, createReducer, on } from '@ngrx/store';
import { FinanceOverviewActions, FINANCE_OVERVIEW_FEATURE_KEY } from './finance-overview.actions';
import { initialFinanceOverviewState } from './finance-overview.state';

export const financeOverviewFeature = createFeature({
    name: FINANCE_OVERVIEW_FEATURE_KEY,
    reducer: createReducer(
        initialFinanceOverviewState,

        on(FinanceOverviewActions.loadOverview, (state, { filter }) => ({
            ...state,
            loading: true,
            error: null,
            filter,
        })),

        on(FinanceOverviewActions.loadOverviewSuccess, (state, { overview }) => ({
            ...state,
            loading: false,
            error: null,
            overview,
        })),

        on(FinanceOverviewActions.loadOverviewFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(FinanceOverviewActions.setFilter, (state, { filter }) => ({
            ...state,
            filter,
        })),

        on(FinanceOverviewActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
