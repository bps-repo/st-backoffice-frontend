import { createFeature, createReducer, on } from '@ngrx/store';
import { FinanceSellersActions, FINANCE_SELLERS_FEATURE_KEY } from './finance-sellers.actions';
import { initialFinanceSellersState } from './finance-sellers.state';

export const financeSellersFeature = createFeature({
    name: FINANCE_SELLERS_FEATURE_KEY,
    reducer: createReducer(
        initialFinanceSellersState,

        on(FinanceSellersActions.loadSellers, (state, { filter }) => ({
            ...state,
            loading: true,
            error: null,
            filter,
        })),

        on(FinanceSellersActions.loadSellersSuccess, (state, { sellers }) => ({
            ...state,
            loading: false,
            error: null,
            sellers,
        })),

        on(FinanceSellersActions.loadSellersFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(FinanceSellersActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
