import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as LevelActions from '../actions/level.actions';
import { LevelService } from 'src/app/core/services/level.service';
import { ApiResponse } from 'src/app/core/services/interfaces/ApiResponseService';
import { Level } from 'src/app/core/models/course/level';

@Injectable()
export class LevelEffects {
  constructor(private actions$: Actions, private levelService: LevelService) {}

  createLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LevelActions.createLevel),
      mergeMap(({ level }) =>
        this.levelService.createLevel(level).pipe(
          map((response: ApiResponse<Level>) =>
            LevelActions.createLevelSuccess({ level: response.data })
          ),
          catchError(error =>
            of(LevelActions.createLevelFailure({ error }))
          )
        )
      )
    )
  );

  loadLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LevelActions.loadLevel),
      mergeMap(({ id }) =>
        this.levelService.getLevelById(id).pipe(
          map((response: ApiResponse<Level>) =>
            LevelActions.loadLevelSuccess({ level: response.data })
          ),
          catchError(error =>
            of(LevelActions.loadLevelFailure({ error }))
          )
        )
      )
    )
  );

  // loadPagedLevels$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(LevelActions.loadPagedLevels),
  //     mergeMap(({ size }) =>
  //       this.levelService.getLevels().pipe(
  //         map((response: ApiResponse<{ content: Level[] }>) =>
  //           LevelActions.loadLevels({ levels: response.data.content })
  //         ),
  //         catchError(error =>
  //           of(LevelActions.loadPagedLevelsFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );

  deleteLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LevelActions.deleteLevel),
      mergeMap(({ id }) =>
        this.levelService.deleteLevel(id).pipe(
          map(() => LevelActions.deleteLevelSuccess({ id })),
          catchError(error =>
            of(LevelActions.deleteLevelFailure({ error }))
          )
        )
      )
    )
  );

  updateLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LevelActions.updateLevel),
      mergeMap(({ id, level }) =>
        this.levelService.updateLevel(id, level).pipe(
          map((response: ApiResponse<Level>) =>
            LevelActions.updateLevelSuccess({ level: response.data })
          ),
          catchError(error =>
            of(LevelActions.updateLevelFailure({ error }))
          )
        )
      )
    )
  );
}
