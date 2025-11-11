import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationService } from '../../services/location.service';
import { LocationActions } from './location.actions';

@Injectable()
export class LocationEffects {
    constructor(
        private actions$: Actions,
        private locationService: LocationService
    ) {}

    loadProvinces$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LocationActions.loadProvinces),
            mergeMap(() =>
                this.locationService.getProvinces().pipe(
                    map((provinces) => LocationActions.loadProvincesSuccess({ provinces })),
                    catchError((error: HttpErrorResponse) =>
                        of(LocationActions.loadProvincesFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    loadProvince$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LocationActions.loadProvince),
            mergeMap(({ provinceId }) =>
                this.locationService.getProvinceById(provinceId).pipe(
                    map((province) => LocationActions.loadProvinceSuccess({ province })),
                    catchError((error: HttpErrorResponse) =>
                        of(LocationActions.loadProvinceFailure({ provinceId, error: error.message }))
                    )
                )
            )
        )
    );
}

