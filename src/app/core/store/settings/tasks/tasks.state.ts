import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TaskItem } from '../../../models/task-item.model';

export interface TasksState extends EntityState<TaskItem> {
  loading: boolean;
  error: any;
  lastUpdated: string | null;
}

export const tasksAdapter = createEntityAdapter<TaskItem>({
  selectId: (task: TaskItem) => task.studentId
});

export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  loading: false,
  error: null,
  lastUpdated: null,
});

