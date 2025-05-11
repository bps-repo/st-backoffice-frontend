import { createAction, props } from '@ngrx/store';
import { Level } from '../../../models/course/level';

export const loadLevels = createAction('[Level] Load Levels');
export const loadLevelsSuccess = createAction('[Level] Load Levels Success', props<{ levels: Level[] }>());
export const loadLevelsFailure = createAction('[Level] Load Levels Failure', props<{ error: any }>());

export const loadLevel = createAction('[Level] Load Level', props<{ id: string }>());
export const loadLevelSuccess = createAction('[Level] Load Level Success', props<{ level: Level }>());
export const loadLevelFailure = createAction('[Level] Load Level Failure', props<{ error: any }>());