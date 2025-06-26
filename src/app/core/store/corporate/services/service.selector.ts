import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ServiceState} from "./service.reducer";

export const selectServiceState = createFeatureSelector<ServiceState>('service');

export const selectAllServices = createSelector(
    selectServiceState,
    (state) => state.services || []
);

export const selectSelectedService = createSelector(
    selectServiceState,
    (state) => state.service
);

export const selectServiceLoading = createSelector(
    selectServiceState,
    (state) => state.loading
);

export const selectServiceError = createSelector(
    selectServiceState,
    (state) => state.error
);
