import {createSelector} from '@ngrx/store';
import {certificatesFeature} from './certificates.feature';
import * as fromCertificates from './certificates.reducer';

export const selectCertificatesState = certificatesFeature.selectCertificatesState;

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
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectCertificatesLoading = createSelector(
    selectCertificatesState,
    (state) => state.loading
);

export const selectCertificatesError = createSelector(
    selectCertificatesState,
    (state) => state.errors
);
