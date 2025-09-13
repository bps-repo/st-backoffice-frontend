import { createFeature, createReducer, on } from '@ngrx/store';

import { CENTER_FEATURE_KEY, CenterActions } from "./centers.actions";
import { centerInitialState, centersAdapter } from "./center.state";

export const CenterFeature = createFeature({
    name: CENTER_FEATURE_KEY,
    reducer: createReducer(
        centerInitialState,

        // Create center
        on(CenterActions.createCenter, (state) => ({
            ...state,
            loadingCreate: true,
            errorCreate: null
        })),
        on(CenterActions.createCenterSuccess, (state, { center }) => centersAdapter.addOne(center, {
            ...state,
            loadingCreate: false,
            errorCreate: null
        })),
        on(CenterActions.createCenterFailure, (state, { error }) => ({
            ...state,
            loadingCreate: false,
            errorCreate: error
        })),

        // Load all centers
        on(CenterActions.loadCenters, (state) => ({
            ...state,
            loading: state.ids.length > 0 ? false : true,
            error: null
        })),
        on(CenterActions.loadCentersSuccess, (state, { centers }) => centersAdapter.setAll(centers, {
            ...state,
            loading: false,
            error: null
        })),
        on(CenterActions.loadCentersFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),

        // Load center
        on(CenterActions.loadCenter, (state) => ({
            ...state,
            loading: state.ids.length > 0 ? false : true,
            error: null
        })),
        on(CenterActions.loadCenterSuccess, (state, { center }) => ({
            ...state,
            selectedCenter: center,
            loading: false,
            error: null
        })),

        on(CenterActions.loadCenterFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error
        })),

        // Delete center
        on(CenterActions.deleteCenter, (state) => ({
            ...state,
            loadingDelete: true,
            errorDelete: null
        })),

        on(CenterActions.deleteCenterSuccess, (state, { id }) =>
            centersAdapter.removeOne(id, {
                ...state,
                loadingDelete: false,
                errorDelete: null
            })
        ),

        on(CenterActions.deleteCenterFailure, (state, { error }) => ({
            ...state,
            loadingDelete: false,
            errorDelete: error
        })),


        // Update center
        on(CenterActions.updateCenter, (state) => ({
            ...state,
            loadingUpdate: true,
            errorUpdate: null
        })),
        on(CenterActions.updateCenterSuccess, (state, { center }) => centersAdapter.updateOne({
            id: center.id,
            changes: center
        }, {
            ...state,
            loadingUpdate: false,
            errorUpdate: null
        })),
        on(CenterActions.updateCenterFailure, (state, { error }) => ({
            ...state,
            loadingUpdate: false,
            errorUpdate: error
        })),

        // Clear centers
        on(CenterActions.clearCenters, (state) => ({
            ...state,
            ...centerInitialState
        })),
        // Clear centers errors
        on(CenterActions.clearCentersErrors, (state) => ({
            ...state,
            error: null,
            errorCreate: null,
            errorUpdate: null,
            errorDelete: null
        })),
    )
});
