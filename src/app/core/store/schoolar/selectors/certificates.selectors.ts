import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SchoolarState } from '../schoolar.state';
import * as fromCertificates from '../reducers/certificates.reducer';

export const selectSchoolarState = createFeatureSelector<SchoolarState>('schoolar');

export const selectCertificatesState = createSelector(
  selectSchoolarState,
  (state: SchoolarState) => state.certificates
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
