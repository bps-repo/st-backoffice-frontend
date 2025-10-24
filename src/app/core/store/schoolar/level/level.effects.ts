import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom, filter, tap } from 'rxjs/operators';
import { LevelService } from 'src/app/core/services/level.service';
import { Level } from 'src/app/core/models/course/level';
import { LevelActions } from "./level.actions";
import { Store } from '@ngrx/store';
import { selectLevelState } from './level.selectors';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable()
export class LevelEffects {
    constructor(
        private actions$: Actions,
        private levelService: LevelService,
        private store: Store,
        private cacheService: CacheService
    ) {}

    createLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.createLevel),
            mergeMap(({ level }) =>
                this.levelService.createLevel(level).pipe(
                    map((created: Level) => LevelActions.createLevelSuccess({ level: created })),
                    catchError(error => of(LevelActions.createLevelFailure({ error })))
                )
            )
        )
    );

    loadLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevel),
            mergeMap(({ id }) =>
                this.levelService.getLevelById(id).pipe(
                    map((loaded: Level) => LevelActions.loadLevelSuccess({ level: loaded })),
                    catchError(error => of(LevelActions.loadLevelFailure({ error })))
                )
            )
        )
    );

    loadLevels$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevels),
            withLatestFrom(this.store.select(selectLevelState)),
            filter(([action, state]) => {
                const { forceRefresh = false } = action;
                return this.cacheService.shouldRefreshCache(
                    state.lastFetch,
                    state.cacheExpired,
                    forceRefresh,
                    state.cacheTimeout
                );
            }),
            exhaustMap(() =>
                this.levelService.getLevels().pipe(
                    map((levels) =>
                        LevelActions.loadLevelsSuccess({ levels })
                    ),
                    catchError(error =>
                        of(LevelActions.loadLevelsFailure({ error }))
                    )
                )
            )
        ))

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
                    map((updated: Level) => LevelActions.updateLevelSuccess({ level: updated })),
                    catchError(error => of(LevelActions.updateLevelFailure({ error })))
                )
            )
        )
    );

    // Cache management effects
    refreshCache$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.refreshCache),
            map(() => LevelActions.loadLevels({ forceRefresh: true }))
        )
    );

    // Auto-refresh cache when it expires
    autoRefreshCache$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LevelActions.loadLevelsSuccess),
            withLatestFrom(this.store.select(selectLevelState)),
            tap(([action, state]) => {
                // Set up a timer to mark cache as expired after timeout
                setTimeout(() => {
                    this.store.dispatch(LevelActions.setCacheExpired({ expired: true }));
                }, state.cacheTimeout);
            })
        ),
        { dispatch: false }
    );
}
