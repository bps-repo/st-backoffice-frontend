import { createAction, props } from '@ngrx/store';
import { Unit } from 'src/app/core/models/course/unit';

// Action para carregar todas as unidades
export const loadUnits = createAction('[Unit] Load Units');

// Action para sucesso no carregamento das unidades
export const loadUnitsSuccess = createAction(
    '[Unit] Load Units Success',
    props<{ units: Unit[] }>()
);

// Action para erro no carregamento das unidades
export const loadUnitsFailure = createAction(
    '[Unit] Load Units Failure',
    props<{ error: any }>()
);

// Action para carregar uma unidade específica
export const loadUnit = createAction(
    '[Unit] Load Unit',
    props<{ id: string }>()
);

// Action para sucesso no carregamento de uma unidade
export const loadUnitSuccess = createAction(
    '[Unit] Load Unit Success',
    props<{ unit: Unit }>()
);

// Action para erro no carregamento de uma unidade
export const loadUnitFailure = createAction(
    '[Unit] Load Unit Failure',
    props<{ error: any }>()
);
