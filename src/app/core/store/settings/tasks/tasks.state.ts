import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TaskItem } from '../../../models/task-item.model';

export interface TasksState extends EntityState<TaskItem> {
  loading: boolean;
  actionLoading: boolean;
  error: any;
  lastUpdated: string | null;
}

export const tasksAdapter = createEntityAdapter<TaskItem>({
  selectId: (task: TaskItem) => task.id
});

export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  loading: false,
  actionLoading: false,
  error: null,
  lastUpdated: null,
});
