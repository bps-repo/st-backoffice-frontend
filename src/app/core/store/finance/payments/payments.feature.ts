import { createFeature, createReducer, on } from '@ngrx/store';
import { PaymentsActions, PAYMENTS_FEATURE_KEY } from './payments.actions';
import { initialPaymentsState, paymentsAdapter } from './payments.state';

export const paymentsFeature = createFeature({
    name: PAYMENTS_FEATURE_KEY,
    reducer: createReducer(
        initialPaymentsState,

        on(PaymentsActions.loadPayments, (state, { page, size }) => ({
            ...state,
            loading: true,
            error: null,
            page,
            size,
        })),

        on(PaymentsActions.loadPaymentsSuccess, (state, { content, totalElements, page, size, totalPages }) =>
            paymentsAdapter.setAll(content, {
                ...state,
                loading: false,
                error: null,
                page,
                size,
                totalElements,
                totalPages,
            }),
        ),

        on(PaymentsActions.loadPaymentsFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(PaymentsActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
