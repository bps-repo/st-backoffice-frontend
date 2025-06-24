import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { CertificatesApiService } from '../../../services/certificates-api.service';
import * as CertificatesActions from './certificates.actions';

@Injectable()
export class CertificatesEffects {
  loadCertificates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesActions.loadCertificates),
      switchMap(() =>
        this.certificatesService.getCertificates().pipe(
          map((certificates) =>
            CertificatesActions.loadCertificatesSuccess({ certificates })
          ),
          catchError((error) =>
            of(CertificatesActions.loadCertificatesFailure({ error }))
          )
        )
      )
    )
  );

  loadCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesActions.loadCertificate),
      mergeMap(({ id }) =>
        this.certificatesService.getCertificate(id).pipe(
          map((certificate) =>
            CertificatesActions.loadCertificateSuccess({ certificate })
          ),
          catchError((error) =>
            of(CertificatesActions.loadCertificateFailure({ error }))
          )
        )
      )
    )
  );

  createCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesActions.createCertificate),
      mergeMap(({ certificate }) =>
        this.certificatesService.createCertificate(certificate).pipe(
          map((newCertificate) =>
            CertificatesActions.createCertificateSuccess({
              certificate: newCertificate,
            })
          ),
          catchError((error) =>
            of(CertificatesActions.createCertificateFailure({ error }))
          )
        )
      )
    )
  );

  updateCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesActions.updateCertificate),
      mergeMap(({ id, changes }) =>
        this.certificatesService.updateCertificate(id, changes).pipe(
          map((updatedCertificate) =>
            CertificatesActions.updateCertificateSuccess({
              certificate: updatedCertificate,
            })
          ),
          catchError((error) =>
            of(CertificatesActions.updateCertificateFailure({ error }))
          )
        )
      )
    )
  );

  deleteCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CertificatesActions.deleteCertificate),
      mergeMap(({ id }) =>
        this.certificatesService.deleteCertificate(id).pipe(
          map(() => CertificatesActions.deleteCertificateSuccess({ id })),
          catchError((error) =>
            of(CertificatesActions.deleteCertificateFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private certificatesService: CertificatesApiService
  ) {}
}
