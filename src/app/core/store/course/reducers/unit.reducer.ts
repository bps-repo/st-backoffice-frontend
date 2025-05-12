import { createFeature, createReducer, on } from '@ngrx/store';
import * as UnitActions from '../actions/unit.actions';
import { Unit } from 'src/app/core/models/course/unit';

export interface UnitState {
  units: Unit[];
  unit: Unit | null;
  loading: boolean;
  error: any;
}

export const initialState: UnitState = {
  units: [],
  unit: null,
  loading: false,
  error: null,
};

export const unitFeature = createFeature({
  name: 'unit',
  reducer: createReducer(
    initialState,

    // Criar unidade
    on(UnitActions.createUnit, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.createUnitSuccess, (state, { unit }) => ({
      ...state,
      units: [...state.units, unit],
      loading: false
    })),
    on(UnitActions.createUnitFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Carregar todas as unidades (não paginado)
    on(UnitActions.loadUnits, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.loadUnitsSuccess, (state, { units }) => ({
      ...state,
      units,
      loading: false,
      error: null
    })),
    on(UnitActions.loadUnitsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Carregar unidade por ID
    on(UnitActions.loadUnit, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.loadUnitSuccess, (state, { unit }) => ({
      ...state,
      unit,
      loading: false,
      error: null
    })),
    on(UnitActions.loadUnitFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Carregar unidades paginadas
    on(UnitActions.loadPagedUnits, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.loadPagedUnitsSuccess, (state, { units }) => ({
      ...state,
      units,
      loading: false
    })),
    on(UnitActions.loadPagedUnitsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Deletar unidade
    on(UnitActions.deleteUnit, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.deleteUnitSuccess, (state, { id }) => ({
      ...state,
      units: state.units.filter(unit => unit.id !== id),
      loading: false
    })),
    on(UnitActions.deleteUnitFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Atualizar unidade
    on(UnitActions.updateUnit, state => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UnitActions.updateUnitSuccess, (state, { unit }) => ({
      ...state,
      unit,
      loading: false,
      error: null
    })),
    on(UnitActions.updateUnitFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    }))
  )
});
