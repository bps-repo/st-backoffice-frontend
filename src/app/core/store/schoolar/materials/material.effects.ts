import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/core/services/material.service';
import { MaterialActions } from './material.actions';

@Injectable()
export class MaterialEffects {
  constructor(private actions$: Actions, private materialService: MaterialService) {}

  loadMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaterialActions.loadMaterials),
      mergeMap(() =>
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
}
