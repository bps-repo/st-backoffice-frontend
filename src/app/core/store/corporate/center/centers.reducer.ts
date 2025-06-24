import {createFeature, createReducer, on} from '@ngrx/store';

import {CENTER_FEATURE_KEY, CenterActions} from "./centers.actions";
import {centerInitialState, centersAdapter} from "./centerState";

export const CenterFeature = createFeature({
    name: CENTER_FEATURE_KEY,
    reducer: createReducer(
        centerInitialState,

        // Create center
        on(CenterActions.createCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.createCenterSuccess, (state, {center}) => ({
            ...state,
            loading: false,
            error: null
        })),
        on(CenterActions.createCenterFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),

        // Load all centers
        on(CenterActions.loadCenters, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.loadCentersSuccess, (state, {centers}) => centersAdapter.setAll(centers, {
            ...state,
            loading: false,
            error: null
        })),
        on(CenterActions.loadCentersFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),


        // Load center
        on(CenterActions.loadCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.loadCenterSuccess, (state, {center}) => centersAdapter.setOne(center, {
            ...state,
            loading: false,
            error: null
        })),

        on(CenterActions.loadCenterFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),


        // Delete center
        on(CenterActions.deleteCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.deleteCenterSuccess, (state, {id}) => ({
            ...state,
            loading: false,
            error: null
        })),
        on(CenterActions.deleteCenterFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),


        // Update center
        on(CenterActions.updateCenter, (state) => ({
            ...state,
            loading: true,
            error: null
        })),
        on(CenterActions.updateCenterSuccess, (state, {center}) => ({
            ...state,
            center,
            loading: false,
            error: null
        })),
        on(CenterActions.updateCenterFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error
        })),

        // Clear centers
        on(CenterActions.clearCenters, (state) => ({
            ...state,
            ...centerInitialState
        })),
        // Clear centers errors
        on(CenterActions.clearCentersErrors, (state) => ({
            ...state,
            error: null
        })),
    )
});
