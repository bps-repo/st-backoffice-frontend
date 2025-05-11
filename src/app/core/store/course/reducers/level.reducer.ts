import { createReducer, on } from '@ngrx/store';
import * as LevelActions from '../actions/level.actions';
import { Level } from '../../../models/course/level';

export interface LevelState {
    levels: Level[];
    selectedLevel: Level | null;
    loading: boolean;
    error: any;
}

export const initialState: LevelState = {
    levels: [],
    selectedLevel: null,
    loading: false,
    error: null,
};

export const levelReducer = createReducer(
    initialState,
    on(LevelActions.loadLevels, (state) => ({ ...state, loading: true })),
    on(LevelActions.loadLevelsSuccess, (state, { levels }) => ({ ...state, levels, loading: false })),
    on(LevelActions.loadLevelsFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(LevelActions.loadLevel, (state) => ({ ...state, loading: true })),
    on(LevelActions.loadLevelSuccess, (state, { level }) => ({ ...state, selectedLevel: level, loading: false })),
    on(LevelActions.loadLevelFailure, (state, { error }) => ({ ...state, error, loading: false }))
);