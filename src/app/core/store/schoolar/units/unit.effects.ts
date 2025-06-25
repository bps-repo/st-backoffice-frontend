import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UnitService } from 'src/app/core/services/unit.service';
import { UnitActions } from './unit.actions';

@Injectable()
export class UnitEffects {
  constructor(private actions$: Actions, private unitService: UnitService) {}

  // Basic CRUD operations
  createUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.createUnit),
      mergeMap(({ unit }) =>
        this.unitService.createUnit(unit).pipe(
          map((response) => UnitActions.createUnitSuccess({ unit: response.data })),
          catchError((error) => of(UnitActions.createUnitFailure({ error: error.message })))
        )
      )
    )
  );

  updateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.updateUnit),
      mergeMap(({ id, unit }) =>
        this.unitService.updateUnit(id, unit).pipe(
          map((response) => UnitActions.updateUnitSuccess({ unit: response.data })),
          catchError((error) => of(UnitActions.updateUnitFailure({ error: error.message })))
        )
      )
    )
  );

  getUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getUnit),
      mergeMap(({ id }) =>
        this.unitService.getUnitById(id).pipe(
          map((response) => UnitActions.getUnitSuccess({ unit: response.data })),
          catchError((error) => of(UnitActions.getUnitFailure({ error: error.message })))
        )
      )
    )
  );

  getPagedUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getPagedUnits),
      mergeMap(({ size }) =>
        this.unitService.getPagedUnits(size).pipe(
          map((response) => UnitActions.getPagedUnitsSuccess({
            units: response.data.content,
            pagination: {
              totalItems: response.data.totalElements,
              totalPages: response.data.totalPages,
              currentPage: response.data.number,
              pageSize: response.data.size
            }
          })),
          catchError((error) => of(UnitActions.getPagedUnitsFailure({ error: error.message })))
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
          catchError((error) => of(UnitActions.deleteUnitFailure({ error: error.message })))
        )
      )
    )
  );

  // Specialized endpoints
  getUnitMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getUnitMaterials),
      mergeMap(({ unitId }) =>
        this.unitService.getUnitMaterials(unitId).pipe(
          map((response) => UnitActions.getUnitMaterialsSuccess({ unitId, materials: response.data })),
          catchError((error) => of(UnitActions.getUnitMaterialsFailure({ error: error.message })))
        )
      )
    )
  );

  removeMaterialFromUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.removeMaterialFromUnit),
      mergeMap(({ unitId, materialId }) =>
        this.unitService.removeMaterialFromUnit(unitId, materialId).pipe(
          map((response) => UnitActions.removeMaterialFromUnitSuccess({ unit: response.data })),
          catchError((error) => of(UnitActions.removeMaterialFromUnitFailure({ error: error.message })))
        )
      )
    )
  );

  updateUnitOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.updateUnitOrder),
      mergeMap(({ unitId, order }) =>
        this.unitService.updateUnitOrder(unitId, order).pipe(
          map((response) => UnitActions.updateUnitOrderSuccess({ unit: response.data })),
          catchError((error) => of(UnitActions.updateUnitOrderFailure({ error: error.message })))
        )
      )
    )
  );

  getUnitClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getUnitClasses),
      mergeMap(({ unitId }) =>
        this.unitService.getUnitClasses(unitId).pipe(
          map((response) => UnitActions.getUnitClassesSuccess({ unitId, classes: response.data })),
          catchError((error) => of(UnitActions.getUnitClassesFailure({ error: error.message })))
        )
      )
    )
  );

  getUnitProgresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getUnitProgresses),
      mergeMap(({ unitId }) =>
        this.unitService.getUnitProgresses(unitId).pipe(
          map((response) => UnitActions.getUnitProgressesSuccess({ unitId, progresses: response.data })),
          catchError((error) => of(UnitActions.getUnitProgressesFailure({ error: error.message })))
        )
      )
    )
  );
}
