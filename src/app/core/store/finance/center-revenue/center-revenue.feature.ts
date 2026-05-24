import { createFeature, createReducer, on } from '@ngrx/store';
import { CenterRevenueActions, FINANCE_CENTER_REVENUE_FEATURE_KEY } from './center-revenue.actions';
import { initialCenterRevenueState } from './center-revenue.state';

export const centerRevenueFeature = createFeature({
    name: FINANCE_CENTER_REVENUE_FEATURE_KEY,
    reducer: createReducer(
        initialCenterRevenueState,

        on(CenterRevenueActions.load, (state, { filter }) => ({
            ...state,
            loading: true,
            error:   null,
            filter,
        })),

        on(CenterRevenueActions.loadSuccess, (state, { data }) => ({
            ...state,
            loading: false,
            error:   null,
            data,
        })),

        on(CenterRevenueActions.loadFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(CenterRevenueActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
