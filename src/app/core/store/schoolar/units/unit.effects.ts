import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, of} from 'rxjs';
import {catchError, map, mergeMap, withLatestFrom, filter, tap} from 'rxjs/operators';
import {UnitService} from 'src/app/core/services/unit.service';
import {UnitActions} from './unit.actions';
import {Store} from '@ngrx/store';
import {selectUnitsState} from './unit.selectors';
import {CacheService} from 'src/app/core/services/cache.service';
import {UnitState} from './unit.state';

@Injectable()
export class UnitEffects {
    constructor(
        private actions$: Actions,
        private unitService: UnitService,
        private store: Store,
        private cacheService: CacheService
    ) {
    }

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

    // Load paged units with cache logic
    loadPagedUnits$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnits),
            withLatestFrom(this.store.select(selectUnitsState)),
            filter(([action, state]) => {
                return this.cacheService.shouldRefreshCache(
                    (state as UnitState).lastFetch,
                    (state as UnitState).cacheExpired,
                    false, // No force refresh for units by default
                    (state as UnitState).cacheTimeout
                );
            }),
            exhaustMap(([action, state]) =>
                this.unitService.loadUnits().pipe(
                    map((units) => {
                        return UnitActions.loadUnitsSuccess({units});
                    }),
                    catchError((error) => of(UnitActions.loadUnitsFailure({error: error.message})))
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

    // Cache management effects
    refreshCache$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.refreshCache),
            map(() => UnitActions.loadUnits())
        )
    );

    // Auto-refresh cache when it expires
    autoRefreshCache$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UnitActions.loadUnitsSuccess),
            withLatestFrom(this.store.select(selectUnitsState)),
            tap(([action, state]) => {
                // Set up a timer to mark cache as expired after timeout
                setTimeout(() => {
                    this.store.dispatch(UnitActions.setCacheExpired({ expired: true }));
                }, (state as UnitState).cacheTimeout);
            })
        ),
        { dispatch: false }
    );
}
