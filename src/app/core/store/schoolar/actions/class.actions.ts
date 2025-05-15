import { createAction, props } from '@ngrx/store';
import { Class } from 'src/app/core/models/academic/class';

export const loadClasses = createAction('[Class] Load Classes');

export const createClass = createAction(
  '[Class] Create Class',
  props<{ classData: Partial<Class> }>()
);

export const createClassSuccess = createAction(
  '[Class] Create Class Success',
  props<{ classData: Class }>()
);

export const createClassFailure = createAction(
  '[Class] Create Class Failure',
  props<{ error: any }>()
);

export const loadClassesSuccess = createAction(
  '[Class] Load Classes Success',
  props<{ classes: Class[] }>()
);

export const loadClassesFailure = createAction(
  '[Class] Load Classes Failure',
  props<{ error: any }>()
);

export const loadClass = createAction(
  '[Class] Load Class',
  props<{ id: string }>()
);

export const loadClassSuccess = createAction(
  '[Class] Load Class Success',
  props<{ classData: Class }>()
);

export const loadClassFailure = createAction(
  '[Class] Load Class Failure',
  props<{ error: any }>()
);

export const loadPagedClasses = createAction(
  '[Class] Load Paged Classes',
  props<{ size: number }>()
);

export const loadPagedClassesSuccess = createAction(
  '[Class] Load Paged Classes Success',
  props<{ classes: any }>() // Substituir `any` por tipo correto se desejar
);

export const loadPagedClassesFailure = createAction(
  '[Class] Load Paged Classes Failure',
  props<{ error: any }>()
);

export const deleteClass = createAction(
  '[Class] Delete Class',
  props<{ id: string }>()
);

export const deleteClassSuccess = createAction(
  '[Class] Delete Class Success',
  props<{ id: string }>()
);

export const deleteClassFailure = createAction(
  '[Class] Delete Class Failure',
  props<{ error: any }>()
);

export const updateClass = createAction(
  '[Class] Update Class',
  props<{ id: string; classData: Partial<Class> }>()
);

export const updateClassSuccess = createAction(
  '[Class] Update Class Success',
  props<{ classData: Class }>()
);

export const updateClassFailure = createAction(
  '[Class] Update Class Failure',
  props<{ error: any }>()
);
