import { CenterFeature } from "./centers.reducer";
import { centersAdapter } from "./center.state";
import { createSelector } from "@ngrx/store";
import { selectAllLevelEntities } from "../../schoolar/level/level.selector";


const {
    selectError,
    selectErrorCreate,
    selectErrorDelete,
    selectErrorUpdate,
    selectLoading,
    selectSelectedCenter,
    selectLoadingUpdate,
    selectLoadingCreate,
    selectLoadingDelete
} = CenterFeature


const {
    selectEntities,
    selectAll,
    selectTotal,
    selectIds
} = centersAdapter.getSelectors(CenterFeature.selectCenterState);


export const selectAllCenters = createSelector(
    selectAll,
    (centers) => centers
)

export const selectCenterEntities = createSelector(
    selectEntities,
    (entities) => entities
);

export const selectCenterById = (id: string) => createSelector(
    selectCenterEntities,
    (entities) => entities[id] || null
);


export const selectCenterIds = selectIds;

export const selectTotalCenters = selectTotal;

// Error selectors
export const selectCenterAnyError = createSelector(
    selectError,
    selectErrorCreate,
    selectErrorUpdate,
    selectErrorDelete,
    (error, createError, updateError, deleteError) =>
        error || createError || updateError || deleteError
);


export const selectErrorCreateCenter = selectErrorCreate;

export const selectErrorUpdateCenter = selectErrorUpdate;

export const selectErrorDeleteCenter = selectErrorDelete;

export const selectErrorCenter = selectError;

export const selectLoadingCenters = selectLoading;

export const selectLoadingCreateCenter = selectLoadingCreate;

export const selectLoadingUpdateCenter = selectLoadingUpdate;

export const selectLoadingDeleteCenter = selectLoadingDelete;

export const selectSelectedCenterId = createSelector(
    selectSelectedCenter,
    (selectedCenter) => selectedCenter
);
