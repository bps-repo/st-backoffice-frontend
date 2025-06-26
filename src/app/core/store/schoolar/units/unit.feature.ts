import {createFeature, createReducer, on} from '@ngrx/store';
import {UNIT_FEATURE_KEY, UnitActions} from './unit.actions';
import {unitInitialState, unitsAdapter} from './unit.state';

export const unitFeature = createFeature({
    name: UNIT_FEATURE_KEY,
    reducer: createReducer(
        unitInitialState,

        // Create unit
        on(UnitActions.createUnit, (state) => ({
            ...state,
            loadingCreate: true,
            createError: null,
        })),
        on(UnitActions.createUnitSuccess, (state, {unit}) =>
            unitsAdapter.addOne(unit, {
                ...state,
                loadingCreate: false,
                createError: null,
            })
        ),
        on(UnitActions.createUnitFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            createError: error,
        })),

        // Update unit
        on(UnitActions.updateUnit, (state) => ({
            ...state,
            loadingUpdate: true,
            updateError: null,
        })),
        on(UnitActions.updateUnitSuccess, (state, {unit}) =>
            unitsAdapter.updateOne(
                {id: unit.id, changes: unit},
                {
                    ...state,
                    loadingUpdate: false,
                    updateError: null,
                }
            )
        ),
        on(UnitActions.updateUnitFailure, (state, {error}) => ({
            ...state,
            loadingUpdate: false,
            updateError: error,
        })),

        // load unit
        on(UnitActions.loadUnit, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(UnitActions.loadUnitSuccess, (state, {unit}) =>
            unitsAdapter.upsertOne(unit, {
                ...state,
                selectedUnitId: unit.id,
                loading: false,
                error: null,
            })
        ),
        on(UnitActions.loadUnitFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // load paged units
        on(UnitActions.loadPagedUnits, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(UnitActions.loadPagedUnitsSuccess, (state, {units, pagination}) =>
            unitsAdapter.setAll(units, {
                ...state,
                loading: false,
                error: null,
                lastFetch: Date.now(),
                cacheExpired: false,
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
            })
        ),
        on(UnitActions.loadPagedUnitsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Delete unit
        on(UnitActions.deleteUnit, (state) => ({
            ...state,
            loadingDelete: true,
            deleteError: null,
        })),
        on(UnitActions.deleteUnitSuccess, (state, {id}) =>
            unitsAdapter.removeOne(id, {
                ...state,
                loadingDelete: false,
                deleteError: null,
                selectedUnitId: state.selectedUnitId === id ? null : state.selectedUnitId,
            })
        ),
        on(UnitActions.deleteUnitFailure, (state, {error}) => ({
            ...state,
            loadingDelete: false,
            deleteError: error,
        })),

        // load unit materials
        on(UnitActions.loadUnitMaterials, (state) => ({
            ...state,
            loadingMaterials: true,
            materialsError: null,
        })),
        on(UnitActions.loadUnitMaterialsSuccess, (state, {unitId, materials}) => ({
            ...state,
            unitMaterials: {
                ...state.unitMaterials,
                [unitId]: materials,
            },
            loadingMaterials: false,
            materialsError: null,
        })),
        on(UnitActions.loadUnitMaterialsFailure, (state, {error}) => ({
            ...state,
            loadingMaterials: false,
            materialsError: error,
        })),

        // Remove material from unit
        on(UnitActions.removeMaterialFromUnit, (state) => ({
            ...state,
            loadingRemoveMaterial: true,
            removeMaterialError: null,
        })),
        on(UnitActions.removeMaterialFromUnitSuccess, (state, {unit}) =>
            unitsAdapter.updateOne(
                {id: unit.id, changes: unit},
                {
                    ...state,
                    loadingRemoveMaterial: false,
                    removeMaterialError: null,
                }
            )
        ),
        on(UnitActions.removeMaterialFromUnitFailure, (state, {error}) => ({
            ...state,
            loadingRemoveMaterial: false,
            removeMaterialError: error,
        })),

        // Update unit order
        on(UnitActions.updateUnitOrder, (state) => ({
            ...state,
            loadingUpdateOrder: true,
            updateOrderError: null,
        })),
        on(UnitActions.updateUnitOrderSuccess, (state, {unit}) =>
            unitsAdapter.updateOne(
                {id: unit.id, changes: unit},
                {
                    ...state,
                    loadingUpdateOrder: false,
                    updateOrderError: null,
                }
            )
        ),
        on(UnitActions.updateUnitOrderFailure, (state, {error}) => ({
            ...state,
            loadingUpdateOrder: false,
            updateOrderError: error,
        })),

        // load unit classes
        on(UnitActions.loadUnitClasses, (state) => ({
            ...state,
            loadingClasses: true,
            classesError: null,
        })),
        on(UnitActions.loadUnitClassesSuccess, (state, {unitId, classes}) => ({
            ...state,
            unitClasses: {
                ...state.unitClasses,
                [unitId]: classes,
            },
            loadingClasses: false,
            classesError: null,
        })),
        on(UnitActions.loadUnitClassesFailure, (state, {error}) => ({
            ...state,
            loadingClasses: false,
            classesError: error,
        })),

        // load unit progresses
        on(UnitActions.loadUnitProgresses, (state) => ({
            ...state,
            loadingProgresses: true,
            progressesError: null,
        })),
        on(UnitActions.loadUnitProgressesSuccess, (state, {unitId, progresses}) => ({
            ...state,
            unitProgresses: {
                ...state.unitProgresses,
                [unitId]: progresses,
            },
            loadingProgresses: false,
            progressesError: null,
        })),
        on(UnitActions.loadUnitProgressesFailure, (state, {error}) => ({
            ...state,
            loadingProgresses: false,
            progressesError: error,
        })),

        // Selection actions
        on(UnitActions.selectUnit, (state, {id}) => ({
            ...state,
            selectedUnitId: id,
        })),
        on(UnitActions.clearSelectedUnit, (state) => ({
            ...state,
            selectedUnitId: null,
        })),

        // Pagination actions
        on(UnitActions.setPage, (state, {page}) => ({
            ...state,
            currentPage: page,
        })),
        on(UnitActions.setPageSize, (state, {size}) => ({
            ...state,
            pageSize: size,
        })),

        // Cache management
        on(UnitActions.setLastFetch, (state, {timestamp}) => ({
            ...state,
            lastFetch: timestamp,
        })),
        on(UnitActions.setCacheExpired, (state, {expired}) => ({
            ...state,
            cacheExpired: expired,
        })),
        on(UnitActions.refreshCache, (state) => ({
            ...state,
            cacheExpired: true,
        })),
        on(UnitActions.clearCache, (state) =>
            unitsAdapter.removeAll({
                ...state,
                unitMaterials: {},
                unitClasses: {},
                unitProgresses: {},
                lastFetch: null,
                cacheExpired: false,
            })
        ),

        // Clear errors
        on(UnitActions.clearError, (state, {errorType}) => {
            const updates: any = {};

            if (errorType === 'general' || !errorType) updates.error = null;
            if (errorType === 'create' || !errorType) updates.createError = null;
            if (errorType === 'update' || !errorType) updates.updateError = null;
            if (errorType === 'delete' || !errorType) updates.deleteError = null;
            if (errorType === 'materials' || !errorType) updates.materialsError = null;
            if (errorType === 'classes' || !errorType) updates.classesError = null;
            if (errorType === 'progresses' || !errorType) updates.progressesError = null;
            if (errorType === 'removeMaterial' || !errorType) updates.removeMaterialError = null;
            if (errorType === 'updateOrder' || !errorType) updates.updateOrderError = null;

            return {...state, ...updates};
        }),
        on(UnitActions.clearAllErrors, (state) => ({
            ...state,
            error: null,
            createError: null,
            updateError: null,
            deleteError: null,
            materialsError: null,
            classesError: null,
            progressesError: null,
            removeMaterialError: null,
            updateOrderError: null,
        }))
    ),
});

export const {name, reducer} = unitFeature;
