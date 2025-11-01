import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TaskItem } from '../../../models/task-item.model';

export const TASKS_FEATURE_KEY = 'Tasks';

export const TasksActions = createActionGroup({
  source: TASKS_FEATURE_KEY,
  events: {
    'Load Daily Tasks': emptyProps(),
    'Load Daily Tasks Success': props<{ tasks: TaskItem[] }>(),
    'Load Daily Tasks Failure': props<{ error: any }>(),
    'Clear Tasks': emptyProps(),
    'Clear Tasks Errors': emptyProps(),
  }
});

