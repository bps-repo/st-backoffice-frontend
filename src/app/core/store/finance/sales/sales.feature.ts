import { createFeature, createReducer, on } from '@ngrx/store';
import { SalesActions, SALES_FEATURE_KEY } from './sales.actions';
import { initialSalesState, salesAdapter } from './sales.state';

export const salesFeature = createFeature({
    name: SALES_FEATURE_KEY,
    reducer: createReducer(
        initialSalesState,
        on(SalesActions.loadSales, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(SalesActions.loadSalesSuccess, (state, { content, page, size, totalElements, totalPages }) =>
            salesAdapter.setAll(content, {
                ...state,
                loading: false,
                error: null,
                page,
                size,
                totalElements,
                totalPages,
            }),
        ),
        on(SalesActions.loadSalesFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),
        on(SalesActions.loadSaleDetails, (state) => ({
            ...state,
            detailLoading: true,
            detailError: null,
        })),
        on(SalesActions.loadSaleDetailsSuccess, (state, { sale }) => ({
            ...state,
            detailLoading: false,
            detailError: null,
            selectedSale: sale,
        })),
        on(SalesActions.loadSaleDetailsFailure, (state, { error }) => ({
            ...state,
            detailLoading: false,
            detailError: error,
        })),
        on(SalesActions.clearSalesError, (state) => ({
            ...state,
            error: null,
        })),
        on(SalesActions.clearSaleDetailsError, (state) => ({
            ...state,
            detailError: null,
        })),
    ),
});
