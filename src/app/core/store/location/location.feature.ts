import { createFeature, createReducer, on } from '@ngrx/store';
import { LOCATION_FEATURE_KEY, LocationActions } from './location.actions';
import { locationInitialState } from './location.state';

export const locationFeature = createFeature({
    name: LOCATION_FEATURE_KEY,
    reducer: createReducer(
        locationInitialState,

        // Load provinces
        on(LocationActions.loadProvinces, (state) => ({
            ...state,
            loadingProvinces: true,
            errorProvinces: null
        })),
        on(LocationActions.loadProvincesSuccess, (state, { provinces }) => ({
            ...state,
            provinces,
            loadingProvinces: false,
            errorProvinces: null
        })),
        on(LocationActions.loadProvincesFailure, (state, { error }) => ({
            ...state,
            loadingProvinces: false,
            errorProvinces: error
        })),

        // Load province with municipalities
        on(LocationActions.loadProvince, (state, { provinceId }) => ({
            ...state,
            loadingMunicipalities: {
                ...state.loadingMunicipalities,
                [provinceId]: true
            },
            errorMunicipalities: {
                ...state.errorMunicipalities,
                [provinceId]: null
            }
        })),
        on(LocationActions.loadProvinceSuccess, (state, { province }) => ({
            ...state,
            municipalities: {
                ...state.municipalities,
                [province.name]: province.municipalities || []
            },
            loadingMunicipalities: {
                ...state.loadingMunicipalities,
                [province.name]: false
            },
            errorMunicipalities: {
                ...state.errorMunicipalities,
                [province.name]: null
            }
        })),
        on(LocationActions.loadProvinceFailure, (state, { provinceId, error }) => ({
            ...state,
            loadingMunicipalities: {
                ...state.loadingMunicipalities,
                [provinceId]: false
            },
            errorMunicipalities: {
                ...state.errorMunicipalities,
                [provinceId]: error
            },
            error: error
        })),

        // Clear errors
        on(LocationActions.clearLocationErrors, (state) => ({
            ...state,
            error: null,
            errorProvinces: null,
            errorMunicipalities: {}
        }))
    )
});

