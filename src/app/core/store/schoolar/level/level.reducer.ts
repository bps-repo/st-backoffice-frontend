import {createFeature, createReducer, on} from '@ngrx/store';
import {levelInitialState, levelsAdapter} from "./level.state";
import {levelActions} from "./level.actions";

export const levelsFeature = createFeature({
    name: 'level',
    reducer: createReducer(
        levelInitialState,
        on(levelActions.createLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(levelActions.createLevelSuccess, (state, {level}) => levelsAdapter.setOne(
            level,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(levelActions.createLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(levelActions.loadLevels, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(levelActions.loadLevelsSuccess, (state, {levels}) => ({
            ...state,
            levels,
            loading: false,
            error: null,
        })),
        on(levelActions.loadLevelsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(levelActions.loadLevel, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(levelActions.loadLevelSuccess, (state, {level}) => ({
            ...state,
            level: level,
            loading: false,
            error: null,
        })),
        on(levelActions.loadLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),
        on(levelActions.deleteLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(levelActions.deleteLevelSuccess, (state, {id}) => levelsAdapter.removeOne(
            id,
            {
                ...state,
                loading: false,
                error: null
            }
        )),
        on(levelActions.deleteLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(levelActions.updateLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(levelActions.updateLevelSuccess, (state, {level}) => ({
            ...state,
            level,
            loading: false,
            error: null
        })),
        on(levelActions.updateLevelFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        }))
    )
});
