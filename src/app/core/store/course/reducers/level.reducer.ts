import {createFeature, createReducer, on} from '@ngrx/store';
import * as LevelActions from '../actions/level.actions';
import {Level} from 'src/app/core/models/course/level';

export interface LevelState {
    levels: Level[];
    level: Level | null;
    loading: boolean;
    error: any;
}

export const initialState: LevelState = {
    levels: [],
    level: null,
    loading: false,
    error: null,
};

export const levelsFeature = createFeature({
    name: 'level',
    reducer: createReducer(
        initialState,
        on(LevelActions.createLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.createLevelSuccess, (state, {level}) => ({
            ...state,
            levels: [...state.levels, level],
            loading: false
        })),
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
        on(LevelActions.loadLevelsSuccess, (state, {levels}) => ({
            ...state,
            levels,
            loading: false,
            error: null,
        })),
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
        on(LevelActions.loadPagedLevels, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.loadPagedLevelsSuccess, (state, {levels}) => ({
            ...state,
            levels,
            loading: false
        })),
        on(LevelActions.loadPagedLevelsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),
        on(LevelActions.deleteLevel, state => ({
            ...state,
            loading: true,
            error: null
        })),
        on(LevelActions.deleteLevelSuccess, (state, {id}) => ({
            ...state,
            levels: state.levels.filter(level => level.id !== id),
            loading: false
        })),
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
