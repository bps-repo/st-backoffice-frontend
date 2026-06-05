import { createFeature, createReducer, on } from '@ngrx/store';
import { TASKS_FEATURE_KEY, TasksActions } from './tasks.actions';
import { tasksAdapter, initialTasksState } from './tasks.state';

export const tasksFeature = createFeature({
  name: TASKS_FEATURE_KEY,
  reducer: createReducer(
    initialTasksState,

    on(TasksActions.loadDailyTasks, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(TasksActions.loadDailyTasksSuccess, (state, { tasks }) => tasksAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString()
    })),
    on(TasksActions.loadDailyTasksFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    on(TasksActions.runDailyTasks, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(TasksActions.runDailyTasksSuccess, (state) => ({
      ...state,
      loading: false
    })),
    on(TasksActions.runDailyTasksFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    on(TasksActions.applyTaskAction, (state) => ({
      ...state,
      actionLoading: true,
      error: null
    })),
    on(TasksActions.applyTaskActionSuccess, (state, { task }) => tasksAdapter.upsertOne(task, {
      ...state,
      actionLoading: false
    })),
    on(TasksActions.applyTaskActionFailure, (state, { error }) => ({
      ...state,
      actionLoading: false,
      error
    })),

    on(TasksActions.clearTasks, (state) => tasksAdapter.removeAll({
      ...state,
      lastUpdated: null
    })),
    on(TasksActions.clearTasksErrors, (state) => ({
      ...state,
      error: null
    }))
  )
});
