import { createAction, props } from '@ngrx/store';

export const loadCertificates = createAction(
  '[Certificates] Load Certificates'
);

export const loadCertificatesSuccess = createAction(
  '[Certificates] Load Certificates Success',
  props<{ certificates: any[] }>()
);

export const loadCertificatesFailure = createAction(
  '[Certificates] Load Certificates Failure',
  props<{ error: any }>()
);

export const loadCertificate = createAction(
  '[Certificates] Load Certificate',
  props<{ id: string }>()
);

export const loadCertificateSuccess = createAction(
  '[Certificates] Load Certificate Success',
  props<{ certificate: any }>()
);

export const loadCertificateFailure = createAction(
  '[Certificates] Load Certificate Failure',
  props<{ error: any }>()
);

export const createCertificate = createAction(
  '[Certificates] Create Certificate',
  props<{ certificate: any }>()
);

export const createCertificateSuccess = createAction(
  '[Certificates] Create Certificate Success',
  props<{ certificate: any }>()
);

export const createCertificateFailure = createAction(
  '[Certificates] Create Certificate Failure',
  props<{ error: any }>()
);

export const updateCertificate = createAction(
  '[Certificates] Update Certificate',
  props<{ id: string, changes: any }>()
);

export const updateCertificateSuccess = createAction(
  '[Certificates] Update Certificate Success',
  props<{ certificate: any }>()
);

export const updateCertificateFailure = createAction(
  '[Certificates] Update Certificate Failure',
  props<{ error: any }>()
);

export const deleteCertificate = createAction(
  '[Certificates] Delete Certificate',
  props<{ id: string }>()
);

export const deleteCertificateSuccess = createAction(
  '[Certificates] Delete Certificate Success',
  props<{ id: string }>()
);

export const deleteCertificateFailure = createAction(
  '[Certificates] Delete Certificate Failure',
  props<{ error: any }>()
);
