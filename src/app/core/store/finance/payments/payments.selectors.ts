import { createSelector } from '@ngrx/store';
import { paymentsAdapter } from './payments.state';
import { paymentsFeature } from './payments.feature';

const { selectAll, selectEntities } = paymentsAdapter.getSelectors();

export const selectPaymentsState = paymentsFeature.selectPaymentsState;
export const selectPaymentsLoading = paymentsFeature.selectLoading;
export const selectPaymentsError = paymentsFeature.selectError;
export const selectPaymentsPage = paymentsFeature.selectPage;
export const selectPaymentsSize = paymentsFeature.selectSize;
export const selectPaymentsTotalElements = paymentsFeature.selectTotalElements;
export const selectPaymentsTotalPages = paymentsFeature.selectTotalPages;

export const selectAllPayments = createSelector(
    selectPaymentsState,
    (state) => selectAll(state),
);

export const selectPaymentsEntities = createSelector(
    selectPaymentsState,
    (state) => selectEntities(state),
);
