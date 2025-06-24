import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import * as CertificatesActions from './certificates.actions';
import { CertificatesState } from '../app.state';

export const certificatesAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: (certificate: any) => certificate.id,
});

export const initialState: CertificatesState = certificatesAdapter.getInitialState({
  selectedCertificateId: null,
  loading: false,
  errors: null,
});

export const certificatesReducer = createReducer(
  initialState,
  on(CertificatesActions.loadCertificates, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CertificatesActions.loadCertificatesSuccess, (state, { certificates }) =>
    certificatesAdapter.setAll(certificates, {
      ...state,
      loading: false,
    })
  ),
  on(CertificatesActions.loadCertificatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CertificatesActions.loadCertificate, (state, { id }) => ({
    ...state,
    selectedCertificateId: id,
    loading: true,
    error: null,
  })),
  on(CertificatesActions.loadCertificateSuccess, (state, { certificate }) =>
    certificatesAdapter.upsertOne(certificate, {
      ...state,
      loading: false,
    })
  ),
  on(CertificatesActions.loadCertificateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CertificatesActions.createCertificate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CertificatesActions.createCertificateSuccess, (state, { certificate }) =>
    certificatesAdapter.addOne(certificate, {
      ...state,
      loading: false,
    })
  ),
  on(CertificatesActions.createCertificateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CertificatesActions.updateCertificate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CertificatesActions.updateCertificateSuccess, (state, { certificate }) =>
    certificatesAdapter.updateOne(
      { id: certificate.id, changes: certificate },
      {
        ...state,
        loading: false,
      }
    )
  ),
  on(CertificatesActions.updateCertificateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CertificatesActions.deleteCertificate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CertificatesActions.deleteCertificateSuccess, (state, { id }) =>
    certificatesAdapter.removeOne(id, {
      ...state,
      loading: false,
    })
  ),
  on(CertificatesActions.deleteCertificateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  certificatesAdapter.getSelectors();
