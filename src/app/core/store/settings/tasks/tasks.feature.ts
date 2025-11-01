import { createFeature, createReducer, on } from '@ngrx/store';
import { TASKS_FEATURE_KEY, TasksActions } from './tasks.actions';
import { tasksAdapter, initialTasksState } from './tasks.state';

export const tasksFeature = createFeature({
  name: TASKS_FEATURE_KEY,
  reducer: createReducer(
    initialTasksState,

    // Load Daily Tasks
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

    // Clear actions
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

