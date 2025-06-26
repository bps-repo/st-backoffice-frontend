import {createFeature, createReducer, on} from '@ngrx/store';
import * as ServiceActions from './service.actions';
import {Service} from 'src/app/core/models/course/service';

export interface ServiceState {
    services: Service[];
    service: Service | null;
    loading: boolean;
    error: any;
}

export const initialState: ServiceState = {
    services: [],
    service: null,
    loading: false,
    error: null,
};

export const serviceFeature = createFeature({
    name: 'service',
    reducer: createReducer(
        initialState,
        on(ServiceActions.createService, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(ServiceActions.createServiceSuccess, (state, {service}) => ({
            ...state,
            services: [...state.services, service],
            loading: false
        })),
        on(ServiceActions.createServiceFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(ServiceActions.loadServices, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(ServiceActions.loadServicesSuccess, (state, {services}) => ({
            ...state,
            services,
            loading: false,
            error: null,
        })),
        on(ServiceActions.loadServicesFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(ServiceActions.loadService, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(ServiceActions.loadServiceSuccess, (state, {service}) => ({
            ...state,
            service: service,
            loading: false,
            error: null,
        })),
        on(ServiceActions.loadServiceFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(ServiceActions.loadPagedServices, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(ServiceActions.loadPagedServicesSuccess, (state, {services}) => ({
            ...state,
            services,
            loading: false
        })),
        on(ServiceActions.loadPagedServicesFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(ServiceActions.deleteService, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(ServiceActions.deleteServiceSuccess, (state, {id}) => ({
            ...state,
            services: state.services.filter(service => service.id !== id),
            loading: false
        })),
        on(ServiceActions.deleteServiceFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(ServiceActions.updateService, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(ServiceActions.updateServiceSuccess, (state, {service}) => ({
            ...state,
            service,
            loading: false,
            error: null
        })),
        on(ServiceActions.updateServiceFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        }))
    )
});
