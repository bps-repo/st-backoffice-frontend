import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {MaterialService} from 'src/app/core/services/material.service';
import {MaterialActions} from './material.actions';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class MaterialEffects {
    private actions$ = inject(Actions);
    private materialService = inject(MaterialService);


    createMaterial$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialActions.createMaterial),
            mergeMap(({material}) =>
                this.materialService.createMaterial(material).pipe(
                    map((material) => MaterialActions.createMaterialSuccess({material})),
                    catchError((error) => of(MaterialActions.createMaterialFailure({error: error.message})))
                )
            )
        )
    );

    createMaterialWithRelations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialActions.createMaterialWithRelations),
            mergeMap(({request}) =>
                this.materialService.createMaterialWithRelations(request).pipe(
                    map((material) => MaterialActions.createMaterialWithRelationsSuccess({material})),
                    catchError((error) => of(MaterialActions.createMaterialWithRelationsFailure({error: error.message})))
                )
            )
        )
    );

    loadMaterialsByActive$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialActions.loadMaterialsByActive),
            mergeMap(({active}) =>
                this.materialService.getMaterialsByActive(active).pipe(
                    map((materials) => MaterialActions.loadMaterialsByActiveSuccess({active, materials})),
                    catchError((error) => of(MaterialActions.loadMaterialsByActiveFailure({error: error.message})))
                )
            )
        )
    );

    loadMaterialsByEntity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialActions.loadMaterialsByEntity),
            mergeMap(({entity, entityId}) =>
                this.materialService.getMaterialsByEntity(entity, entityId).pipe(
                    map((materials) => MaterialActions.loadMaterialsByEntitySuccess({entity, entityId, materials})),
                    catchError((error: HttpErrorResponse) => of(MaterialActions.loadMaterialsByEntityFailure({byEntityError: error.error.message})))
                )
            )
        )
    );

    loadMaterialsByUploader$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MaterialActions.loadMaterialsByUploader),
            mergeMap(({uploaderId}) =>
                this.materialService.getMaterialsByUploader(uploaderId).pipe(
                    map((materials) => MaterialActions.loadMaterialsByUploaderSuccess({uploaderId, materials})),
                    catchError((error) => of(MaterialActions.loadMaterialsByUploaderFailure({error: error.message})))
                )
            )
        )
    );
}
