import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UnitState } from '../reducers/unit.reducer';

// Seleciona todo o estado do recurso "unit"
export const selectUnitState = createFeatureSelector<UnitState>('unit');

// Lista de todas as unidades
export const selectAllUnits = createSelector(
  selectUnitState,
  (state) => state.units || []
);

// Unidade atualmente selecionada
export const selectSelectedUnit = createSelector(
  selectUnitState,
  (state) => state.unit
);

// Status de carregamento
export const selectUnitLoading = createSelector(
  selectUnitState,
  (state) => state.loading
);

// Erros do estado
export const selectUnitError = createSelector(
  selectUnitState,
  (state) => state.error
);
