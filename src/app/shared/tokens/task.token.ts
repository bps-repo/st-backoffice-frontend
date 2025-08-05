import { InjectionToken } from '@angular/core';
import { Task } from 'src/app/features/settings/features/tasks/models/task.model';

export const TASK_DATA = new InjectionToken<Task | Task[]>('task-data');