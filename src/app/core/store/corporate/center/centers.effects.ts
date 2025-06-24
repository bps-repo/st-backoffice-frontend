import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {CenterService} from 'src/app/core/services/center.service';
import {CenterActions} from "./centers.actions";

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
                    catchError((error) => of(CenterActions.loadCenterFailure({error})))
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
                    catchError((error) => of(CenterActions.loadCentersFailure({error})))
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
                    catchError((error) => of(CenterActions.deleteCenterFailure({error})))
                )
            )
        )
    );
}
