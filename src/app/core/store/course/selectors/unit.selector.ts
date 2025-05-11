import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitState } from '../reducers/unit.reducer';

// Seleciona o estado das unidades
export const selectUnitState = createFeatureSelector<UnitState>('unit');

// Seleciona todas as unidades
export const selectAllUnits = createSelector(
    selectUnitState,
    (state) => state.units
);

// Seleciona a unidade atualmente carregada
export const selectSelectedUnit = createSelector(
    selectUnitState,
    (state) => state.selectedUnit
);

// Seleciona o estado de carregamento
export const selectUnitLoading = createSelector(
    selectUnitState,
    (state) => state.loading
);

// Seleciona o erro, se houver
export const selectUnitError = createSelector(
    selectUnitState,
    (state) => state.error
);
