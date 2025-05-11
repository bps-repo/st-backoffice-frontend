import { createReducer, on } from '@ngrx/store';
import * as UnitActions from '../actions/unit.actions';
import { Unit } from 'src/app/core/models/course/unit';

export interface UnitState {
    units: Unit[];
    selectedUnit: Unit | null;
    loading: boolean;
    error: any;
}

export const initialState: UnitState = {
    units: [],
    selectedUnit: null,
    loading: false,
    error: null,
};

export const unitReducer = createReducer(
    initialState,
    on(UnitActions.loadUnits, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UnitActions.loadUnitsSuccess, (state, { units }) => ({
        ...state,
        units,
        loading: false,
    })),
    on(UnitActions.loadUnitsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(UnitActions.loadUnit, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(UnitActions.loadUnitSuccess, (state, { unit }) => ({
        ...state,
        selectedUnit: unit,
        loading: false,
    })),
    on(UnitActions.loadUnitFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);
