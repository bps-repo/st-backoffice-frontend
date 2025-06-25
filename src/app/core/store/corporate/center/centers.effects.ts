import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {CenterService} from 'src/app/core/services/center.service';
import {CenterActions} from "./centers.actions";
import {HttpErrorResponse} from "@angular/common/module.d-CnjH8Dlt";

@Injectable()
export class CentersEffects {
    constructor(private actions$: Actions, private centerService: CenterService) {
    }

    loadCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.loadCenter),
            mergeMap(({id}) =>
                this.centerService.getCenterById(id).pipe(
                    map((response) => CenterActions.loadCenterSuccess({center: response})),
                    catchError((error: HttpErrorResponse) => of(CenterActions.loadCenterFailure({error: error.message})))
                )
            )
        )
    );

    loadCenters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.loadCenters),
            mergeMap(() =>
                this.centerService.getAllCenters().pipe(
                    map((centers) => CenterActions.loadCentersSuccess({centers})),
                    catchError((error: HttpErrorResponse) => of(CenterActions.loadCentersFailure({error: error.message})))
                )
            )
        )
    );

    deleteCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.deleteCenter),
            mergeMap(({id}) =>
                this.centerService.deleteCenter(id).pipe(
                    map(() => CenterActions.deleteCenterSuccess({id})),
                    catchError((error: HttpErrorResponse) => of(CenterActions.deleteCenterFailure({error: error.message})))
                )
            )
        )
    );

    createCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.createCenter),
            mergeMap(({center}) =>
                this.centerService.createCenter(center).pipe(
                    map((createdCenter) => CenterActions.createCenterSuccess({center: createdCenter})),
                    catchError((error: HttpErrorResponse) => of(CenterActions.createCenterFailure({error: error.message})))
                )
            )
        )
    );

    updateCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterActions.updateCenter),
            mergeMap(({id, center}) =>
                this.centerService.updateCenter(id, center).pipe(
                    map((updatedCenter) => CenterActions.updateCenterSuccess({center: updatedCenter})),
                    catchError((error: HttpErrorResponse) => of(CenterActions.updateCenterFailure({error: error.message})))
                )
            )
        )
    );
}
