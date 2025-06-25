import { createFeature, createReducer, on } from '@ngrx/store';
import { MATERIAL_FEATURE_KEY, MaterialActions } from './material.actions';
import { materialInitialState, materialsAdapter } from './materialState';

export const materialFeature = createFeature({
  name: MATERIAL_FEATURE_KEY,
  reducer: createReducer(
    materialInitialState,

    // Load materials
    on(MaterialActions.loadMaterials, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MaterialActions.loadMaterialsSuccess, (state, { materials }) =>
      materialsAdapter.setAll(materials, {
        ...state,
        loading: false,
        error: null,
        lastFetch: Date.now(),
        cacheExpired: false,
      })
    ),
    on(MaterialActions.loadMaterialsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create material
    on(MaterialActions.createMaterial, (state) => ({
      ...state,
      loadingCreate: true,
      createError: null,
    })),
    on(MaterialActions.createMaterialSuccess, (state, { material }) =>
      materialsAdapter.addOne(material, {
        ...state,
        loadingCreate: false,
        createError: null,
      })
    ),
    on(MaterialActions.createMaterialFailure, (state, { error }) => ({
      ...state,
      loadingCreate: false,
      createError: error,
    })),

    // Load materials by active status
    on(MaterialActions.loadMaterialsByActive, (state) => ({
      ...state,
      loadingByActive: true,
      byActiveError: null,
    })),
    on(MaterialActions.loadMaterialsByActiveSuccess, (state, { active, materials }) => ({
      ...state,
      materialsByActive: {
        ...state.materialsByActive,
        [active.toString()]: materials,
      },
      loadingByActive: false,
      byActiveError: null,
    })),
    on(MaterialActions.loadMaterialsByActiveFailure, (state, { error }) => ({
      ...state,
      loadingByActive: false,
      byActiveError: error,
    })),

    // Load materials by type
    on(MaterialActions.loadMaterialsByType, (state) => ({
      ...state,
      loadingByType: true,
      byTypeError: null,
    })),
    on(MaterialActions.loadMaterialsByTypeSuccess, (state, { type, materials }) => ({
      ...state,
      materialsByType: {
        ...state.materialsByType,
        [type]: materials,
      },
      loadingByType: false,
      byTypeError: null,
    })),
    on(MaterialActions.loadMaterialsByTypeFailure, (state, { error }) => ({
      ...state,
      loadingByType: false,
      byTypeError: error,
    })),

    // Load materials by uploader
    on(MaterialActions.loadMaterialsByUploader, (state) => ({
      ...state,
      loadingByUploader: true,
      byUploaderError: null,
    })),
    on(MaterialActions.loadMaterialsByUploaderSuccess, (state, { uploaderId, materials }) => ({
      ...state,
      materialsByUploader: {
        ...state.materialsByUploader,
        [uploaderId]: materials,
      },
      loadingByUploader: false,
      byUploaderError: null,
    })),
    on(MaterialActions.loadMaterialsByUploaderFailure, (state, { error }) => ({
      ...state,
      loadingByUploader: false,
      byUploaderError: error,
    })),

    // Selection actions
    on(MaterialActions.selectMaterial, (state, { id }) => ({
      ...state,
      selectedMaterialId: id,
    })),
    on(MaterialActions.clearSelectedMaterial, (state) => ({
      ...state,
      selectedMaterialId: null,
    })),

    // Cache management
    on(MaterialActions.setLastFetch, (state, { timestamp }) => ({
      ...state,
      lastFetch: timestamp,
    })),
    on(MaterialActions.setCacheExpired, (state, { expired }) => ({
      ...state,
      cacheExpired: expired,
    })),
    on(MaterialActions.refreshCache, (state) => ({
      ...state,
      cacheExpired: true,
    })),
    on(MaterialActions.clearCache, (state) =>
      materialsAdapter.removeAll({
        ...state,
        materialsByActive: {},
        materialsByType: {},
        materialsByUploader: {},
        lastFetch: null,
        cacheExpired: false,
      })
    ),

    // Clear errors
    on(MaterialActions.clearError, (state, { errorType }) => {
      const updates: any = {};

      if (errorType === 'general' || !errorType) updates.error = null;
      if (errorType === 'create' || !errorType) updates.createError = null;
      if (errorType === 'byActive' || !errorType) updates.byActiveError = null;
      if (errorType === 'byType' || !errorType) updates.byTypeError = null;
      if (errorType === 'byUploader' || !errorType) updates.byUploaderError = null;

      return { ...state, ...updates };
    }),
    on(MaterialActions.clearAllErrors, (state) => ({
      ...state,
      error: null,
      createError: null,
      byActiveError: null,
      byTypeError: null,
      byUploaderError: null,
    }))
  ),
});

export const { name, reducer, selectMaterialState } = materialFeature;
