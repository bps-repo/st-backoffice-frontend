import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as UnitActions from '../actions/unit.actions';
import { UnitService } from '../../../services/unit.service';

@Injectable()
export class UnitEffects {

    constructor(private actions$: Actions, private unitService: UnitService) {}

    // Effect para carregar todas as unidades
    loadUnits$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnits),
            mergeMap(() =>
                this.unitService.getAllUnits().pipe(
                    map((units) => UnitActions.loadUnitsSuccess({ units })),
                    catchError((error) => of(UnitActions.loadUnitsFailure({ error })))
                )
            )
        )
    );

    // Effect para carregar uma unidade específica
    loadUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnit),
            mergeMap((action) =>
                this.unitService.getUnitById(action.id).pipe(
                    map((unit) => UnitActions.loadUnitSuccess({ unit })),
                    catchError((error) => of(UnitActions.loadUnitFailure({ error })))
                )
            )
        )
    );
}
