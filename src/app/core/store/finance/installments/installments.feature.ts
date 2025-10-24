import {createFeature, createReducer, createSelector, on} from '@ngrx/store';
import {InstallmentsActions, INSTALLMENTS_FEATURE_KEY} from './installments.actions';
import {initialInstallmentsState, installmentsAdapter} from './installments.state';

export const installmentsFeature = createFeature({
    name: INSTALLMENTS_FEATURE_KEY,
    reducer: createReducer(
        initialInstallmentsState,

        // Load Installments
        on(InstallmentsActions.loadInstallments, (state, {page, size}) => ({
            ...state,
            loading: true,
            error: null,
            page,
            size,
        })),

        on(InstallmentsActions.loadInstallmentsSuccess, (state, {content, totalElements, page, size, totalPages}) =>
            installmentsAdapter.setAll(content, {
                ...state,
                loading: false,
                error: null,
                page,
                size,
                totalElements,
                totalPages,
                lastUpdated: Date.now(),
            })
        ),

        on(InstallmentsActions.loadInstallmentsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Pay Installment
        on(InstallmentsActions.payInstallment, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),

        on(InstallmentsActions.payInstallmentSuccess, (state, {installment}) =>
            installmentsAdapter.upsertOne(installment, {
                ...state,
                loading: false,
                error: null,
            })
        ),

        on(InstallmentsActions.payInstallmentFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
    )
});
