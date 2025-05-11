import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as LevelActions from '../actions/level.actions';
import { LevelService } from '../../../services/level.service';

@Injectable()
export class LevelEffects {
    constructor(private actions$: Actions, private levelService: LevelService) {}

    loadLevels$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevels),
            mergeMap(() =>
                this.levelService.getLevels().pipe(
                    map((levels) => LevelActions.loadLevelsSuccess({ levels })),
                    catchError((error) => of(LevelActions.loadLevelsFailure({ error })))
                )
            )
        )
    );

    loadLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevel),
            mergeMap((action) =>
                this.levelService.getLevelById(action.id).pipe(
                    map((level) => LevelActions.loadLevelSuccess({ level })),
                    catchError((error) => of(LevelActions.loadLevelFailure({ error })))
                )
            )
        )
    );
}