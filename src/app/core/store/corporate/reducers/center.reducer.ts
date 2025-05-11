import { createFeature, createReducer, on } from '@ngrx/store';
import * as CenterActions from '../actions/center.actions';
import { Center } from 'src/app/core/models/corporate/center';

export interface CenterState {
    centers: Center[];
    center: Center | null;
    loading: boolean;
    error: any;
}

export const initialState: CenterState = {
    centers: [],
    center: null,
    loading: false,
    error: null
};

export const centerFeature = createFeature({
    name: 'center',
    reducer: createReducer(
        initialState,
        on(CenterActions.createCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.createCenterSuccess, (state, { center }) => ({
            ...state,
            centers: [...state.centers, center],
            loading: false,
            error: null
        })),
        on(CenterActions.createCenterFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(CenterActions.loadCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.loadCenters, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.loadCenterSuccess, (state, { center }) => ({
            ...state,
            center,
            loading: false,
            error: null
        })),
        on(CenterActions.loadCenterFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(CenterActions.loadPagedCenters, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.loadPagedCentersSuccess, (state, { centers }) => ({
            ...state,
            centers,
            loading: false,
            error: null
        })),
        on(CenterActions.loadPagedCentersFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(CenterActions.deleteCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.deleteCenterSuccess, (state, { id }) => ({
            ...state,
            centers: state.centers.filter((center) => center.id !== id),
            loading: false,
            error: null
        })),
        on(CenterActions.deleteCenterFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),
        on(CenterActions.updateCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.updateCenterSuccess, (state, { center }) => ({
            ...state,
            center,
            loading: false,
            error: null
        })),
        on(CenterActions.updateCenterFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        }))
    )
});
