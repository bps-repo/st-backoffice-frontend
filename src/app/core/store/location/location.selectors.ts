import { locationFeature } from './location.feature';
import { createSelector } from '@ngrx/store';

const {
    selectProvinces,
    selectMunicipalities,
    selectLoadingProvinces,
    selectLoadingMunicipalities,
    selectError,
    selectErrorProvinces,
    selectErrorMunicipalities
} = locationFeature;

// Province selectors
export const selectAllProvinces = selectProvinces;
export const selectProvincesLoading = selectLoadingProvinces;
export const selectProvincesError = selectErrorProvinces;

// Municipality selectors
export const selectMunicipalitiesByProvinceId = (provinceId: string) =>
    createSelector(
        selectMunicipalities,
        (municipalities) => municipalities[provinceId] || []
    );

export const selectMunicipalitiesLoadingByProvinceId = (provinceId: string) =>
    createSelector(
        selectLoadingMunicipalities,
        (loadingMunicipalities) => loadingMunicipalities[provinceId] || false
    );

export const selectMunicipalitiesErrorByProvinceId = (provinceId: string) =>
    createSelector(
        selectErrorMunicipalities,
        (errorMunicipalities) => errorMunicipalities[provinceId] || null
    );

// Combined error selector
export const selectLocationAnyError = createSelector(
    selectError,
    selectErrorProvinces,
    (error, errorProvinces) => error || errorProvinces
);

