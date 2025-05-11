import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CenterState } from '../reducers/center.reducer';

export const selectCenterState = createFeatureSelector<CenterState>('center');


export const selectAllCenters = createSelector(
    selectCenterState,
    (state) => state.centers || [] // Retorna um array vazio se 'centers' for null ou undefined
);


export const selectSelectedCenter = createSelector(
    selectCenterState,
    (state) => state.center
);

export const selectCenterLoading = createSelector(
    selectCenterState,
    (state) => state.loading
);

export const selectCenterError = createSelector(
    selectCenterState,
    (state) => state.error
);
