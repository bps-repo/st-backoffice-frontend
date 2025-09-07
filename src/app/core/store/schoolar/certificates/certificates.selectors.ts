import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCertificates from './certificates.reducer';
import {AppState} from "../../index";

export const selectSchoolarState = createFeatureSelector<AppState>('schoolar');

export const selectCertificatesState = createSelector(
    selectSchoolarState,
    (state: AppState) => state.certificates
);

export const selectAllCertificates = createSelector(
    selectCertificatesState,
    fromCertificates.selectAll
);

export const selectCertificatesEntities = createSelector(
    selectCertificatesState,
    fromCertificates.selectEntities
);

export const selectSelectedCertificateId = createSelector(
    selectCertificatesState,
    (state) => state.selectedCertificateId
);

export const selectSelectedCertificate = createSelector(
    selectCertificatesEntities,
    selectSelectedCertificateId,
    (entities, selectedId) => selectedId && entities[selectedId]
);

export const selectCertificatesLoading = createSelector(
    selectCertificatesState,
    (state) => state.loading
);

export const selectCertificatesError = createSelector(
    selectCertificatesState,
    (state) => state.errors
);
