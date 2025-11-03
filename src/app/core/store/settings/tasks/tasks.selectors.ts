import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tasksAdapter, TasksState } from './tasks.state';
import { tasksFeature } from './tasks.feature';

export const selectTasksState = createFeatureSelector<TasksState>(tasksFeature.name);

export const {
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
  selectAll: selectAllTasks,
  selectTotal: selectTasksTotal,
} = tasksAdapter.getSelectors(selectTasksState);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state: TasksState) => state.error
);

export const selectTasksLastUpdated = createSelector(
  selectTasksState,
  (state: TasksState) => state.lastUpdated
);

export const selectPendingRegistrations = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.taskType === 'NO_ACTIVE_CONTRACT')
);

export const selectOverdueInstallments = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.taskType === 'INSTALLMENT_DUE_SOON')
);

