import {Injectable} from '@angular/core';
import {Actions, ofType, createEffect} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map, mergeMap} from 'rxjs/operators';
import {LevelService} from 'src/app/core/services/level.service';
import {ApiResponse} from 'src/app/core/services/interfaces/ApiResponseService';
import {Level} from 'src/app/core/models/course/level';
import {LevelActions} from "./level.actions";
import {HttpErrorResponse} from "@angular/common/module.d-CnjH8Dlt";

@Injectable()
export class LevelEffects {
    constructor(private actions$: Actions, private levelService: LevelService) {
    }

    createLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.createLevel),
            mergeMap(({level}) =>
                this.levelService.createLevel(level).pipe(
                    map((response) =>
                        LevelActions.createLevelSuccess({level: response})
                    ),
                    catchError(error =>
                        of(LevelActions.createLevelFailure({error}))
                    )
                )
            )
        )
    );

    loadLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevel),
            mergeMap(({id}) =>
                this.levelService.getLevelById(id).pipe(
                    map((response) =>
                        LevelActions.loadLevelSuccess({level: response})
                    ),
                    catchError(error =>
                        of(LevelActions.loadLevelFailure({error}))
                    )
                )
            )
        )
    );

    loadLevels$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevels),
            exhaustMap(() =>
                this.levelService.getLevels().pipe(
                    map((levels) =>
                        LevelActions.loadLevelsSuccess({levels})
                    ),
                    catchError(error =>
                        of(LevelActions.loadLevelsFailure({error}))
                    )
                )
            )
        ))

    deleteLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.deleteLevel),
            mergeMap(({id}) =>
                this.levelService.deleteLevel(id).pipe(
                    map(() => LevelActions.deleteLevelSuccess({id})),
                    catchError((error: HttpErrorResponse) =>
                        of(LevelActions.deleteLevelFailure({error: error.message}))
                    )
                )
            )
        )
    );

    updateLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.updateLevel),
            mergeMap(({id, level}) =>
                this.levelService.updateLevel(id, level).pipe(
                    map((response) =>
                        LevelActions.updateLevelSuccess({level: response})
                    ),
                    catchError(error =>
                        of(LevelActions.updateLevelFailure({error}))
                    )
                )
            )
        )
    );
}
