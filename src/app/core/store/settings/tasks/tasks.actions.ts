import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TaskAction, TaskItem } from '../../../models/task-item.model';

export const TASKS_FEATURE_KEY = 'Tasks';

export const TasksActions = createActionGroup({
  source: TASKS_FEATURE_KEY,
  events: {
    'Load Daily Tasks': emptyProps(),
    'Load Daily Tasks Success': props<{ tasks: TaskItem[] }>(),
    'Load Daily Tasks Failure': props<{ error: any }>(),

    'Run Daily Tasks': props<{ centerId: string }>(),
    'Run Daily Tasks Success': emptyProps(),
    'Run Daily Tasks Failure': props<{ error: any }>(),

    'Apply Task Action': props<{ taskId: string; action: TaskAction; resolvedBy?: string }>(),
    'Apply Task Action Success': props<{ task: TaskItem }>(),
    'Apply Task Action Failure': props<{ error: any }>(),

    'Clear Tasks': emptyProps(),
    'Clear Tasks Errors': emptyProps(),
  }
});
