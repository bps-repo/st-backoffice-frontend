import {Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {LevelService} from 'src/app/core/services/level.service';
import {ApiResponse} from 'src/app/core/services/interfaces/ApiResponseService';
import {Level} from 'src/app/core/models/course/level';
import {levelActions} from "./level.actions";

@Injectable()
export class LevelEffects {
    constructor(private actions$: Actions, private levelService: LevelService) {
    }

    createLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(levelActions.createLevel),
            mergeMap(({level}) =>
                this.levelService.createLevel(level).pipe(
                    map((response: ApiResponse<Level>) =>
                        levelActions.createLevelSuccess({level: response.data})
                    ),
                    catchError(error =>
                        of(levelActions.createLevelFailure({error}))
                    )
                )
            )
        )
    );

    loadLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(levelActions.loadLevel),
            mergeMap(({id}) =>
                this.levelService.getLevelById(id).pipe(
                    map((response: ApiResponse<Level>) =>
                        levelActions.loadLevelSuccess({level: response.data})
                    ),
                    catchError(error =>
                        of(levelActions.loadLevelFailure({error}))
                    )
                )
            )
        )
    );

    deleteLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(levelActions.deleteLevel),
            mergeMap(({id}) =>
                this.levelService.deleteLevel(id).pipe(
                    map(() => levelActions.deleteLevelSuccess({id})),
                    catchError(error =>
                        of(levelActions.deleteLevelFailure({error}))
                    )
                )
            )
        )
    );

    updateLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(levelActions.updateLevel),
            mergeMap(({id, level}) =>
                this.levelService.updateLevel(id, level).pipe(
                    map((response: ApiResponse<Level>) =>
                        levelActions.updateLevelSuccess({level: response.data})
                    ),
                    catchError(error =>
                        of(levelActions.updateLevelFailure({error}))
                    )
                )
            )
        )
    );
}
