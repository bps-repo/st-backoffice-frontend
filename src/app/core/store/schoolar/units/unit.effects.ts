import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {UnitService} from 'src/app/core/services/unit.service';
import {UnitActions} from './unit.actions';

@Injectable()
export class UnitEffects {
    constructor(private actions$: Actions, private unitService: UnitService) {
    }

    // Basic CRUD operations

    loadUnits$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnits),
            mergeMap(() =>
                this.unitService.loadUnits().pipe(
                    map((units) => UnitActions.loadUnitsSuccess({units: units})),
                    catchError((error) => of(UnitActions.loadUnitsFailure({error: error.message})))
                )
            )
        )
    );

    createUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.createUnit),
            mergeMap(({unit}) =>
                this.unitService.createUnit(unit).pipe(
                    map((response) => UnitActions.createUnitSuccess({unit: response.data})),
                    catchError((error) => of(UnitActions.createUnitFailure({error: error.message})))
                )
            )
        )
    );

    updateUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.updateUnit),
            mergeMap(({id, unit}) =>
                this.unitService.updateUnit(id, unit).pipe(
                    map((response) => UnitActions.updateUnitSuccess({unit: response.data})),
                    catchError((error) => of(UnitActions.updateUnitFailure({error: error.message})))
                )
            )
        )
    );

    loadUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnit),
            mergeMap(({id}) =>
                this.unitService.loadUnitById(id).pipe(
                    map((response) => UnitActions.loadUnitSuccess({unit: response.data})),
                    catchError((error) => of(UnitActions.loadUnitFailure({error: error.message})))
                )
            )
        )
    );

    deleteUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.deleteUnit),
            mergeMap(({id}) =>
                this.unitService.deleteUnit(id).pipe(
                    map(() => UnitActions.deleteUnitSuccess({id})),
                    catchError((error) => of(UnitActions.deleteUnitFailure({error: error.message})))
                )
            )
        )
    );

    // Specialized endpoints
    loadUnitMaterials$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnitMaterials),
            mergeMap(({unitId}) =>
                this.unitService.loadUnitMaterials(unitId).pipe(
                    map((response) => UnitActions.loadUnitMaterialsSuccess({unitId, materials: response.data})),
                    catchError((error) => of(UnitActions.loadUnitMaterialsFailure({error: error.message})))
                )
            )
        )
    );

    removeMaterialFromUnit$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.removeMaterialFromUnit),
            mergeMap(({unitId, materialId}) =>
                this.unitService.removeMaterialFromUnit(unitId, materialId).pipe(
                    map((response) => UnitActions.removeMaterialFromUnitSuccess({unit: response.data})),
                    catchError((error) => of(UnitActions.removeMaterialFromUnitFailure({error: error.message})))
                )
            )
        )
    );

    updateUnitOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.updateUnitOrder),
            mergeMap(({unitId, order}) =>
                this.unitService.updateUnitOrder(unitId, order).pipe(
                    map((response) => UnitActions.updateUnitOrderSuccess({unit: response.data})),
                    catchError((error) => of(UnitActions.updateUnitOrderFailure({error: error.message})))
                )
            )
        )
    );

    loadUnitClasses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnitClasses),
            mergeMap(({unitId}) =>
                this.unitService.loadUnitClasses(unitId).pipe(
                    map((response) => UnitActions.loadUnitClassesSuccess({unitId, classes: response.data})),
                    catchError((error) => of(UnitActions.loadUnitClassesFailure({error: error.message})))
                )
            )
        )
    );

    loadUnitProgresses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnitProgresses),
            mergeMap(({unitId}) =>
                this.unitService.loadUnitProgresses(unitId).pipe(
                    map((response) => UnitActions.loadUnitProgressesSuccess({unitId, progresses: response.data})),
                    catchError((error) => of(UnitActions.loadUnitProgressesFailure({error: error.message})))
                )
            )
        )
    );
}
