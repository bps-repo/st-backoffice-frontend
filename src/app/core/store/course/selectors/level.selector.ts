import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LevelState } from '../reducers/level.reducer';

export const selectLevelState = createFeatureSelector<LevelState>('level');

export const selectAllLevels = createSelector(
    selectLevelState,
    (state) => state.levels || []
);

export const selectSelectedLevel = createSelector(
    selectLevelState,
    (state) => state.level
);

export const selectLevelLoading = createSelector(
    selectLevelState,
    (state) => state.loading
);

export const selectLevelError = createSelector(
    selectLevelState,
    (state) => state.error
);
