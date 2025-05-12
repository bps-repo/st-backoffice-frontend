import { createAction, props } from '@ngrx/store';
import { Level } from 'src/app/core/models/course/level';

// Carregar todos os níveis
export const loadLevels = createAction('[Level] Load Levels');

export const loadLevelsSuccess = createAction(
  '[Level] Load Levels Success',
  props<{ levels: Level[] }>()
);

export const loadLevelsFailure = createAction(
  '[Level] Load Levels Failure',
  props<{ error: any }>()
);

// Carregar nível individual
export const loadLevel = createAction(
  '[Level] Load Level',
  props<{ id: string }>()
);

export const loadLevelSuccess = createAction(
  '[Level] Load Level Success',
  props<{ level: Level }>()
);

export const loadLevelFailure = createAction(
  '[Level] Load Level Failure',
  props<{ error: any }>()
);

// Criar nível
export const createLevel = createAction(
  '[Level] Create Level',
  props<{ level: Partial<Level> }>()
);

export const createLevelSuccess = createAction(
  '[Level] Create Level Success',
  props<{ level: Level }>()
);

export const createLevelFailure = createAction(
  '[Level] Create Level Failure',
  props<{ error: any }>()
);

// Atualizar nível
export const updateLevel = createAction(
  '[Level] Update Level',
  props<{ id: string; level: Partial<Level> }>()
);

export const updateLevelSuccess = createAction(
  '[Level] Update Level Success',
  props<{ level: Level }>()
);

export const updateLevelFailure = createAction(
  '[Level] Update Level Failure',
  props<{ error: any }>()
);

// Deletar nível
export const deleteLevel = createAction(
  '[Level] Delete Level',
  props<{ id: string }>()
);

export const deleteLevelSuccess = createAction(
  '[Level] Delete Level Success',
  props<{ id: string }>()
);

export const deleteLevelFailure = createAction(
  '[Level] Delete Level Failure',
  props<{ error: any }>()
);

// Carregar níveis paginados
export const loadPagedLevels = createAction(
  '[Level] Load Paged Levels',
  props<{ size: number }>()
);

export const loadPagedLevelsSuccess = createAction(
  '[Level] Load Paged Levels Success',
  props<{ levels: any }>() // Substitua por tipo paginado se existir
);

export const loadPagedLevelsFailure = createAction(
  '[Level] Load Paged Levels Failure',
  props<{ error: any }>()
);
