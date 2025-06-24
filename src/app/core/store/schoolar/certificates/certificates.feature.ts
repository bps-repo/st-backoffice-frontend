import { createFeature } from '@ngrx/store';
import { certificatesReducer } from './certificates.reducer';

export const certificatesFeature = createFeature({
  name: 'certificates',
  reducer: certificatesReducer,
});

export const {
  selectEntities,
  selectSelectedCertificateId,
} = certificatesFeature;

export const selectSelectedCertificate = (state: any) => {
  const entities = selectEntities(state);
  const selectedId = selectSelectedCertificateId(state);
  return selectedId ? entities[selectedId] : null;
};
