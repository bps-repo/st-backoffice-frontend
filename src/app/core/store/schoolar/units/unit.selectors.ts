import {createSelector} from '@ngrx/store';
import {unitFeature} from './unit.feature';
import {unitsAdapter} from './unit.state';

// Basic selectors from feature
export const {
    selectUnitsState,
    selectLoading,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLoadingMaterials,
    selectLoadingClasses,
    selectLoadingProgresses,
    selectLoadingRemoveMaterial,
    selectLoadingUpdateOrder,
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectMaterialsError,
    selectClassesError,
    selectProgressesError,
    selectRemoveMaterialError,
    selectUpdateOrderError,
    selectSelectedUnitId,
    selectUnitMaterials,
    selectUnitClasses,
    selectUnitProgresses,
    selectCurrentPage,
    selectPageSize,
    selectTotalItems,
    selectTotalPages,
    selectLastFetch,
    selectCacheExpired
} = unitFeature;

// Entity adapter selectors
const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = unitsAdapter.getSelectors(unitFeature.selectUnitsState);

// Basic entity selectors
export const selectAllUnits = selectAll;
export const selectUnitEntities = selectEntities;
export const selectUnitIds = selectIds;
export const selectTotalUnits = selectTotal;

// Selected unit selector
export const selectSelectedUnit = createSelector(
    selectUnitEntities,
    selectSelectedUnitId,
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Get unit by ID
export const selectUnitById = (id: string) => createSelector(
    selectUnitEntities,
    (entities) => entities[id] || null
);

// Get unit materials by unit ID
export const selectUnitMaterialsByUnitId = (unitId: string) => createSelector(
    selectUnitMaterials,
    (unitMaterials) => unitMaterials[unitId] || []
);

// Get unit classes by unit ID
export const selectUnitClassesByUnitId = (unitId: string) => createSelector(
    selectUnitClasses,
    (unitClasses) => unitClasses[unitId] || []
);

// Get unit progresses by unit ID
export const selectUnitProgressesByUnitId = (unitId: string) => createSelector(
    selectUnitProgresses,
    (unitProgresses) => unitProgresses[unitId] || []
);

// Error selectors
export const selectAnyError = createSelector(
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectMaterialsError,
    selectClassesError,
    selectProgressesError,
    selectRemoveMaterialError,
    selectUpdateOrderError,
    (error, createError, updateError, deleteError, materialsError, classesError, progressesError, removeMaterialError, updateOrderError) =>
        error || createError || updateError || deleteError || materialsError || classesError || progressesError || removeMaterialError || updateOrderError
);

// Loading selectors
export const selectAnyLoading = createSelector(
    selectLoading,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLoadingMaterials,
    selectLoadingClasses,
    selectLoadingProgresses,
    selectLoadingRemoveMaterial,
    selectLoadingUpdateOrder,
    (loading, loadingCreate, loadingUpdate, loadingDelete, loadingMaterials, loadingClasses, loadingProgresses, loadingRemoveMaterial, loadingUpdateOrder) =>
        loading || loadingCreate || loadingUpdate || loadingDelete || loadingMaterials || loadingClasses || loadingProgresses || loadingRemoveMaterial || loadingUpdateOrder
);

// Cache selectors
export const selectCacheTimeout = createSelector(
    selectUnitsState,
    (state) => state.cacheTimeout
);

export const selectCacheStatus = createSelector(
    selectLastFetch,
    selectCacheTimeout,
    (lastFetch, timeout) => ({
        lastFetch,
        timeout,
        age: lastFetch ? Date.now() - lastFetch : null,
        isExpired: lastFetch ? (Date.now() - lastFetch) > timeout : true
    })
);

// Pagination selectors
export const selectPaginationInfo = createSelector(
    selectCurrentPage,
    selectPageSize,
    selectTotalItems,
    selectTotalPages,
    (currentPage, pageSize, totalItems, totalPages) => ({
        currentPage,
        pageSize,
        totalItems,
        totalPages
    })
);

// Filtered selectors
export const selectUnitsSortedByOrder = createSelector(
    selectAllUnits,
    (units) => [...units].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        return a.name.localeCompare(b.name);
    })
);

export const selectUnitsByLevelId = (levelId: string) => createSelector(
    selectAllUnits,
    (units) => units.filter(unit => unit.level?.id === levelId)
);

export const selectActiveUnits = createSelector(
    selectAllUnits,
    (units) => units.filter(unit => unit.status === 'active' && !unit.status.includes('deleted'))
);
