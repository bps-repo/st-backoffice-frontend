import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LevelState, levelsAdapter } from './level.state';
import { Level } from 'src/app/core/models/course/level';

export const selectLevelState = createFeatureSelector<LevelState>('levels');

export const {
  selectIds: selectLevelIds,
  selectEntities: selectLevelEntities,
  selectAll: selectAllLevels,
  selectTotal: selectLevelCount,
} = levelsAdapter.getSelectors(selectLevelState);

export const selectLoading = createSelector(
  selectLevelState,
  (state) => state.loading
);

export const selectLoadingCreate = createSelector(
  selectLevelState,
  (state) => state.loadingCreate
);

export const selectLoadingUpdate = createSelector(
  selectLevelState,
  (state) => state.loadingUpdate
);

export const selectLoadingDelete = createSelector(
  selectLevelState,
  (state) => state.loadingDelete
);

export const selectError = createSelector(
  selectLevelState,
  (state) => state.error
);

export const selectCreateError = createSelector(
  selectLevelState,
  (state) => state.createError
);

export const selectUpdateError = createSelector(
  selectLevelState,
  (state) => state.updateError
);

export const selectDeleteError = createSelector(
  selectLevelState,
  (state) => state.deleteError
);

export const selectSelectedLevelId = createSelector(
  selectLevelState,
  (state) => state.selectedLevelId
);

export const selectSelectedLevel = createSelector(
  selectLevelEntities,
  selectSelectedLevelId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Cache-related selectors
export const selectLastFetch = createSelector(
  selectLevelState,
  (state) => state.lastFetch
);

export const selectCacheExpired = createSelector(
  selectLevelState,
  (state) => state.cacheExpired
);

export const selectCacheTimeout = createSelector(
  selectLevelState,
  (state) => state.cacheTimeout
);

export const selectCacheStatus = createSelector(
  selectLastFetch,
  selectCacheTimeout,
  (lastFetch, timeout) => ({
    lastFetch,
    timeout,
    age: lastFetch ? Date.now() - lastFetch : null,
    isExpired: lastFetch ? (Date.now() - lastFetch) > timeout : true
  })
);

export const selectLevelById = (id: string) => createSelector(
  selectLevelEntities,
  (entities) => entities[id] || null
);

export const selectLevelsByStatus = (status: string) => createSelector(
  selectAllLevels,
  (levels) => levels.filter(level => (level as any).status === status)
);
