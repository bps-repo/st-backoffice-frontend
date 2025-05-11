import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CenterActions from '../actions/center.actions';
import { CenterService } from 'src/app/core/services/center.service';

@Injectable()
export class CenterEffects {
    constructor(private actions$: Actions, private centerService: CenterService) {}


    createCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.createCenter),
            mergeMap(({ center }) =>
                this.centerService.createCenter(center).pipe(
                    map((response) => CenterActions.createCenterSuccess({ center: response.data })),
                    catchError((error) => of(CenterActions.createCenterFailure({ error })))
                )
            )
        )
    );

    updateCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.updateCenter),
            mergeMap(({ id, center }) =>
                this.centerService.updateCenter(id, center).pipe(
                    map((response) => CenterActions.updateCenterSuccess({ center: response.data })),
                    catchError((error) => of(CenterActions.updateCenterFailure({ error })))
                )
            )
        )
    );

    loadCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.loadCenter),
            mergeMap(({ id }) =>
                this.centerService.getCenterById(id).pipe(
                    map((response) => CenterActions.loadCenterSuccess({ center: response.data })),
                    catchError((error) => of(CenterActions.loadCenterFailure({ error })))
                )
            )
        )
    );

    loadCenters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.loadCenters),
            mergeMap(() =>
                this.centerService.getAllCenters().pipe(
                    map((centers) => CenterActions.loadCentersSuccess({ centers })),
                    catchError((error) => of(CenterActions.loadCentersFailure({ error })))
                )
            )
        )
    );

    loadPagedCenters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.loadPagedCenters),
            mergeMap(({ size }) =>
                this.centerService.getPagedCenters(size).pipe(
                    map((response) => CenterActions.loadPagedCentersSuccess({ centers: response.data.content })),
                    catchError((error) => of(CenterActions.loadPagedCentersFailure({ error })))
                )
            )
        )
    );

    deleteCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.deleteCenter),
            mergeMap(({ id }) =>
                this.centerService.deleteCenter(id).pipe(
                    map(() => CenterActions.deleteCenterSuccess({ id })),
                    catchError((error) => of(CenterActions.deleteCenterFailure({ error })))
                )
            )
        )
    );

}
