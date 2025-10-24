import {createSelector} from '@ngrx/store';
import {installmentsAdapter} from './installments.state';
import {installmentsFeature} from './installments.feature';
import {Installment} from 'src/app/core/models/payment/installment';

const {selectAll, selectEntities} = installmentsAdapter.getSelectors();

export const selectInstallmentsState = installmentsFeature.selectInstallmentsState;
export const selectLoading = installmentsFeature.selectLoading;
export const selectError = installmentsFeature.selectError;
export const selectPage = installmentsFeature.selectPage;
export const selectSize = installmentsFeature.selectSize;
export const selectTotalElements = installmentsFeature.selectTotalElements;
export const selectTotalPages = installmentsFeature.selectTotalPages;

export const selectAllInstallments = createSelector(
    selectInstallmentsState,
    (state) => selectAll(state)
);

export const selectInstallmentsEntities = createSelector(
    selectInstallmentsState,
    (state) => selectEntities(state)
);

export const selectSummary = createSelector(selectAllInstallments, (items: Installment[]) => {
    const total = items.length;
    const paid = items.filter(i => i.status === 'PAID').length;
    const pending = items.filter(i => i.status === 'PENDING_PAYMENT').length;
    const overdue = items.filter(i => i.status === 'OVERDUE').length;
    return {total, paid, pending, overdue};
});
