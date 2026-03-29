import {createSelector} from '@ngrx/store';
import {serviceAdapter} from "./services.state";
import {serviceFeature} from './service.reducer';


const {} = serviceFeature;

const {
    selectAll,
} = serviceAdapter.getSelectors(serviceFeature.selectServiceState);


export const selectServiceState = createSelector(
    serviceFeature.selectServiceState,
    (state) => state
);

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
