import { createSelector } from '@ngrx/store';
import { materialFeature } from './material.feature';
import { materialsAdapter } from './material.state';
import { selectCreateError } from '../level/level.selector';

// Entity adapter selectors

const {
    selectByActiveError,
    selectByEntityError,
    selectByUploaderError,
    selectLoadingByEntity,
    selectLoading,
    selectLoadingCreate,
    selectLoadingByUploader,
    selectMaterialsByActive,
    selectLoadingByActive,
    selectMaterialsByEntity,
    selectSelectedMaterialId,
    selectMaterialsByUploader,
    selectError,

} = materialFeature

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,

} = materialsAdapter.getSelectors(materialFeature.selectMaterialsState);

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
export const selectMaterialsByEntityValue = (entity: string) => createSelector(
    selectMaterialsByEntity,
    (materialsByEntity) => materialsByEntity[entity] || []
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
    selectByEntityError,
    selectByActiveError,
    selectByUploaderError,
    (error, createError, byEnityError, byActiveError, byUploaderError) =>
        error || createError || byEnityError || byActiveError || byUploaderError
);

// Loading selectors
export const selectAnyLoading = createSelector(
    selectLoading,
    selectLoadingCreate,
    selectLoadingByActive,
    selectLoadingByEntity,
    selectLoadingByUploader,
    (loading, loadingCreate, loadingByActive, loadingByType, loadingByUploader) =>
        loading || loadingCreate || loadingByActive || loadingByType || loadingByUploader
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

export const selectMaterialsByUnitId = (unitId: string) => createSelector(
    selectAllMaterials,
    (materials) => materials.filter(material =>
        material.units && material.units.some(unit => unit.id === unitId)
    )
);
