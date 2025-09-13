import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom, filter, tap } from 'rxjs/operators';
import { MaterialService } from 'src/app/core/services/material.service';
import { MaterialActions } from './material.actions';
import { Store } from '@ngrx/store';
import { selectMaterialState } from './material.feature';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable()
export class MaterialEffects {
  constructor(
    private actions$: Actions,
    private materialService: MaterialService,
    private store: Store,
    private cacheService: CacheService
  ) {}

  loadMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterials),
      withLatestFrom(this.store.select(selectMaterialState)),
      filter(([action, state]) => {
        return this.cacheService.shouldRefreshCache(
          state.lastFetch,
          state.cacheExpired,
          false, // No force refresh for materials by default
          state.cacheTimeout
        );
      }),
      mergeMap(([action, state]) =>
        this.materialService.getMaterials().pipe(
          map((materials) => MaterialActions.loadMaterialsSuccess({ materials })),
          catchError((error) => of(MaterialActions.loadMaterialsFailure({ error: error.message })))
        )
      )
    )
  );

  createMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.createMaterial),
      mergeMap(({ material }) =>
        this.materialService.createMaterial(material).pipe(
          map((material) => MaterialActions.createMaterialSuccess({ material })),
          catchError((error) => of(MaterialActions.createMaterialFailure({ error: error.message })))
        )
      )
    )
  );

  loadMaterialsByActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterialsByActive),
      mergeMap(({ active }) =>
        this.materialService.getMaterialsByActive(active).pipe(
          map((materials) => MaterialActions.loadMaterialsByActiveSuccess({ active, materials })),
          catchError((error) => of(MaterialActions.loadMaterialsByActiveFailure({ error: error.message })))
        )
      )
    )
  );

  loadMaterialsByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterialsByType),
      mergeMap(({ type }) =>
        this.materialService.getMaterialsByType(type).pipe(
          map((materials) => MaterialActions.loadMaterialsByTypeSuccess({ type, materials })),
          catchError((error) => of(MaterialActions.loadMaterialsByTypeFailure({ error: error.message })))
        )
      )
    )
  );

  loadMaterialsByUploader$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterialsByUploader),
      mergeMap(({ uploaderId }) =>
        this.materialService.getMaterialsByUploader(uploaderId).pipe(
          map((materials) => MaterialActions.loadMaterialsByUploaderSuccess({ uploaderId, materials })),
          catchError((error) => of(MaterialActions.loadMaterialsByUploaderFailure({ error: error.message })))
        )
      )
    )
  );

  // Cache management effects
  refreshCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.refreshCache),
      map(() => MaterialActions.loadMaterials())
    )
  );

  // Auto-refresh cache when it expires
  autoRefreshCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterialsSuccess),
      withLatestFrom(this.store.select(selectMaterialState)),
      tap(([action, state]) => {
        // Set up a timer to mark cache as expired after timeout
        setTimeout(() => {
          this.store.dispatch(MaterialActions.setCacheExpired({ expired: true }));
        }, state.cacheTimeout);
      })
    ),
    { dispatch: false }
  );
}
