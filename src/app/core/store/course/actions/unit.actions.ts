import { createAction, props } from '@ngrx/store';
import { Unit } from 'src/app/core/models/course/unit';

// Carregar todas as unidades
export const loadUnits = createAction('[Unit] Load Units');

export const loadUnitsSuccess = createAction(
  '[Unit] Load Units Success',
  props<{ units: Unit[] }>()
);

export const loadUnitsFailure = createAction(
  '[Unit] Load Units Failure',
  props<{ error: any }>()
);

// Carregar unidade individual
export const loadUnit = createAction(
  '[Unit] Load Unit',
  props<{ id: string }>()
);

export const loadUnitSuccess = createAction(
  '[Unit] Load Unit Success',
  props<{ unit: Unit }>()
);

export const loadUnitFailure = createAction(
  '[Unit] Load Unit Failure',
  props<{ error: any }>()
);

// Criar unidade
export const createUnit = createAction(
  '[Unit] Create Unit',
  props<{ unit: Partial<Unit> }>()
);

export const createUnitSuccess = createAction(
  '[Unit] Create Unit Success',
  props<{ unit: Unit }>()
);

export const createUnitFailure = createAction(
  '[Unit] Create Unit Failure',
  props<{ error: any }>()
);

// Atualizar unidade
export const updateUnit = createAction(
  '[Unit] Update Unit',
  props<{ id: string; unit: Partial<Unit> }>()
);

export const updateUnitSuccess = createAction(
  '[Unit] Update Unit Success',
  props<{ unit: Unit }>()
);

export const updateUnitFailure = createAction(
  '[Unit] Update Unit Failure',
  props<{ error: any }>()
);

// Deletar unidade
export const deleteUnit = createAction(
  '[Unit] Delete Unit',
  props<{ id: string }>()
);

export const deleteUnitSuccess = createAction(
  '[Unit] Delete Unit Success',
  props<{ id: string }>()
);

export const deleteUnitFailure = createAction(
  '[Unit] Delete Unit Failure',
  props<{ error: any }>()
);

// Carregar unidades paginadas
export const loadPagedUnits = createAction(
  '[Unit] Load Paged Units',
  props<{ size: number }>()
);

export const loadPagedUnitsSuccess = createAction(
  '[Unit] Load Paged Units Success',
  props<{ units: any }>() // Substitua por tipo paginado se desejar
);

export const loadPagedUnitsFailure = createAction(
  '[Unit] Load Paged Units Failure',
  props<{ error: any }>()
);
