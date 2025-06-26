import {createFeature, createReducer, on} from '@ngrx/store';
import {levelInitialState, levelsAdapter} from "./level.state";
import {LevelActions} from "./level.actions";

export const levelsFeature = createFeature({
    name: 'level',
    reducer: createReducer(
        levelInitialState,

        on(LevelActions.createLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.createLevelSuccess, (state, {level}) => levelsAdapter.setOne(
            level,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(LevelActions.createLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),


        on(LevelActions.loadLevels, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(LevelActions.loadLevelsSuccess, (state, {levels}) => levelsAdapter.setAll(
            levels,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(LevelActions.loadLevelsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(LevelActions.loadLevel, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(LevelActions.loadLevelSuccess, (state, {level}) => ({
            ...state,
            level: level,
            loading: false,
            error: null,
        })),
        on(LevelActions.loadLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(LevelActions.deleteLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.deleteLevelSuccess, (state, {id}) => levelsAdapter.removeOne(
            id,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(LevelActions.deleteLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(LevelActions.updateLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.updateLevelSuccess, (state, {level}) => ({
            ...state,
            level,
            loading: false,
            error: null
        })),
        on(LevelActions.updateLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        }))
    )
});
