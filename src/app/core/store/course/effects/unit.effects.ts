import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UnitService } from 'src/app/core/services/unit.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as UnitActions from '../actions/unit.actions';
import { Unit } from 'src/app/core/models/course/unit';
import { ApiResponse } from 'src/app/core/services/interfaces/ApiResponseService';

@Injectable()
export class UnitEffects {
  constructor(private actions$: Actions, private unitService: UnitService) {}

  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.createUnit),
      mergeMap(({ unit }) =>
        this.unitService.createUnit(unit).pipe(
          map((response: ApiResponse<Unit>) =>
            UnitActions.createUnitSuccess({ unit: response.data })
          ),
          catchError(error => of(UnitActions.createUnitFailure({ error })))
        )
      )
    )
  );

  loadUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.loadUnit),
      mergeMap(({ id }) =>
        this.unitService.getUnitById(id).pipe(
          map((response: ApiResponse<Unit>) =>
            UnitActions.loadUnitSuccess({ unit: response.data })
          ),
          catchError(error => of(UnitActions.loadUnitFailure({ error })))
        )
      )
    )
  );

  loadPagedUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.loadPagedUnits),
      mergeMap(({ size }) =>
        this.unitService.getPagedUnits(size).pipe(
          map((response: ApiResponse<{ content: Unit[] }>) =>
            UnitActions.loadPagedUnitsSuccess({ units: response.data.content })
          ),
          catchError(error => of(UnitActions.loadPagedUnitsFailure({ error })))
        )
      )
    )
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.deleteUnit),
      mergeMap(({ id }) =>
        this.unitService.deleteUnit(id).pipe(
          map(() => UnitActions.deleteUnitSuccess({ id })),
          catchError(error => of(UnitActions.deleteUnitFailure({ error })))
        )
      )
    )
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.updateUnit),
      mergeMap(({ id, unit }) =>
        this.unitService.updateUnit(id, unit).pipe(
          map((response: ApiResponse<Unit>) =>
            UnitActions.updateUnitSuccess({ unit: response.data })
          ),
          catchError(error => of(UnitActions.updateUnitFailure({ error })))
        )
      )
    )
  );
}
