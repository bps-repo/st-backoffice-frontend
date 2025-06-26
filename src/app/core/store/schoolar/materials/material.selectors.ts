import { createSelector } from '@ngrx/store';
import { materialFeature } from './material.feature';
import { materialsAdapter } from './materialState';
import { shouldRefreshCache } from './materialState';

// Basic selectors from feature
export const {
  selectMaterialState,
  selectLoading,
  selectLoadingCreate,
  selectLoadingByActive,
  selectLoadingByType,
  selectLoadingByUploader,
  selectError,
  selectCreateError,
  selectByActiveError,
  selectByTypeError,
  selectByUploaderError,
  selectSelectedMaterialId,
  selectMaterialsByActive,
  selectMaterialsByType,
  selectMaterialsByUploader,
  selectLastFetch,
  selectCacheExpired
} = materialFeature;

// Entity adapter selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = materialsAdapter.getSelectors(materialFeature.selectMaterialState);

// Basic entity selectors
export const selectAllMaterials = selectAll;
export const selectMaterialEntities = selectEntities;
export const selectMaterialIds = selectIds;
export const selectTotalMaterials = selectTotal;

// Selected material selector
export const selectSelectedMaterial = createSelector(
  selectMaterialEntities,
  selectSelectedMaterialId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Get material by ID
export const selectMaterialById = (id: string) => createSelector(
  selectMaterialEntities,
  (entities) => entities[id] || null
);

// Get materials by active status
export const selectMaterialsByActiveStatus = (active: boolean) => createSelector(
  selectMaterialsByActive,
  (materialsByActive) => materialsByActive[active.toString()] || []
);

// Get materials by type
export const selectMaterialsByTypeValue = (type: string) => createSelector(
  selectMaterialsByType,
  (materialsByType) => materialsByType[type] || []
);

// Get materials by uploader
export const selectMaterialsByUploaderId = (uploaderId: string) => createSelector(
  selectMaterialsByUploader,
  (materialsByUploader) => materialsByUploader[uploaderId] || []
);

// Error selectors
export const selectAnyError = createSelector(
  selectError,
  selectCreateError,
  selectByActiveError,
  selectByTypeError,
  selectByUploaderError,
  (error, createError, byActiveError, byTypeError, byUploaderError) =>
    error || createError || byActiveError || byTypeError || byUploaderError
);

// Loading selectors
export const selectAnyLoading = createSelector(
  selectLoading,
  selectLoadingCreate,
  selectLoadingByActive,
  selectLoadingByType,
  selectLoadingByUploader,
  (loading, loadingCreate, loadingByActive, loadingByType, loadingByUploader) =>
    loading || loadingCreate || loadingByActive || loadingByType || loadingByUploader
);

// Cache selectors
export const selectShouldRefreshCache = createSelector(
  selectMaterialState,
  (state) => shouldRefreshCache(state)
);

// Filtered selectors
export const selectActiveMaterials = createSelector(
  selectAllMaterials,
  (materials) => materials.filter(material => material.active)
);

export const selectInactiveMaterials = createSelector(
  selectAllMaterials,
  (materials) => materials.filter(material => !material.active)
);

export const selectMaterialsSortedByUploadDate = createSelector(
  selectAllMaterials,
  (materials) => [...materials].sort((a, b) =>
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  )
);

export const selectMaterialsByUnitId = (unitId: string) => createSelector(
  selectAllMaterials,
  (materials) => materials.filter(material =>
    material.units && material.units.some(unit => unit.id === unitId)
  )
);
