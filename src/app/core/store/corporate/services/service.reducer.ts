import { createFeature, createReducer, on } from '@ngrx/store';
import * as ServiceActions from './service.actions';
import { initialState, serviceAdapter, serviceFeatureKey } from './services.state';


export const serviceFeature = createFeature({
    name: serviceFeatureKey,
    reducer: createReducer(
        initialState,
        on(ServiceActions.createService, state => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: true,
            createError: null,
        })),
        on(ServiceActions.createServiceSuccess, (state, { service }) => serviceAdapter.addOne(service, {
            ...state,
            loadingCreate: false,
            loading: false,
            createError: null,
            error: null,
        })),
        on(ServiceActions.createServiceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            loadingCreate: false,
            createError: error,
            error
        })),
        on(ServiceActions.loadServices, (state) => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadServicesSuccess, (state, { services }) => serviceAdapter.setAll(services, {
            ...state,
            loading: false,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadServicesFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadService, (state) => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadServiceSuccess, (state, { service }) => serviceAdapter.setOne(service, {
            ...state,
            loading: false,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadServiceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadPagedServices, state => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadPagedServicesSuccess, (state, { services }) => serviceAdapter.setAll(services, {
            ...state,
            loading: false,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.loadPagedServicesFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.deleteService, state => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.deleteServiceSuccess, (state, { id }) => ({
            ...state,
            services: serviceAdapter.removeOne(id, state),
            loading: false,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.deleteServiceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.updateService, state => ({
            ...state,
            loading: true,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.updateServiceSuccess, (state, { service }) => serviceAdapter.updateOne({ id: service.id, changes: service }, {
            ...state,
            loading: false,
            error: null,
            loadingCreate: false,
            createError: null,
        })),
        on(ServiceActions.updateServiceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
            loadingCreate: false,
            createError: null,
        }))
    )
});
