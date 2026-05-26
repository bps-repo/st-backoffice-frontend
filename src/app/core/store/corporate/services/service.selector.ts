import {createSelector} from '@ngrx/store';
import {initialState, serviceAdapter} from "./services.state";
import {serviceFeature} from './service.reducer';


const {} = serviceFeature;

const {
    selectAll,
} = serviceAdapter.getSelectors();


export const selectServiceState = createSelector(
    serviceFeature.selectServiceState,
    (state) => state ?? initialState
);

export const selectSelectedService = createSelector(
    selectServiceState,
    (state) => (state.selectedServiceId ? state.entities[state.selectedServiceId] || null : null)
);

/** Aggregate loading flags for corporate service mutations / detail load. */
export const selectServiceLoading = createSelector(
    selectServiceState,
    (state) => state.loading || state.loadingCreate || state.loadingUpdate || state.loadingDelete || false
);

export const selectServiceError = createSelector(
    selectServiceState,
    (state) => state.error || state.createError || state.updateError || state.deleteError || null
);

export const selectAllServices = createSelector(
    selectServiceState,
    (state) => selectAll(state ?? initialState)
);

export const selectServicesPage = createSelector(
    selectServiceState,
    (state) => state.page,
);

export const selectServicesSize = createSelector(
    selectServiceState,
    (state) => state.size,
);

export const selectServicesTotalElements = createSelector(
    selectServiceState,
    (state) => state.totalElements,
);
