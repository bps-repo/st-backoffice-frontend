import { createFeatureSelector, createSelector } from '@ngrx/store';
import { serviceAdapter, ServiceState } from "./services.state";
import { serviceFeature } from './service.reducer';


const {
    selectError,
    selectLoading,
    selectLoadingCreate,
    selectLoadingDelete,
    selectLoadingUpdate,
    selectSelectedServiceId,
} = serviceFeature;

const {
    selectEntities,
    selectAll,
    selectTotal,
    selectIds
} = serviceAdapter.getSelectors(serviceFeature.selectServiceState);


export const selectServiceState = createSelector(
    serviceFeature.selectServiceState,
    (state) => state
);


export const selectAllServices = selectAll;


export const selectSelectedService = createSelector(
    selectServiceState,
    (state) => state.entities[state.selectedServiceId!] || null
);

export const selectServiceLoading = createSelector(
    selectServiceState,
    (state) => state.loading || state.loadingCreate || state.loadingUpdate || state.loadingDelete || false
);

export const selectServiceError = createSelector(
    selectServiceState,
    (state) => state.error || state.createError || state.updateError || state.deleteError || null
);
