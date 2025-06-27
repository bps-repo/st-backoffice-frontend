import {levelsFeature} from "./level.reducer";
import {levelsAdapter} from "./level.state";
import {createSelector} from "@ngrx/store";


export const {
    selectCreateLevelSuccess,
    selectLevelsState,
    selectUpdateError,
    selectSelectedLevelId,
    selectDeleteError,
    selectCreateError,
    selectError,
    selectLoading,
    selectLoadingUpdate,
    selectLoadingCreate,
    selectLoadingDelete
} = levelsFeature


const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = levelsAdapter.getSelectors(levelsFeature.selectLevelsState)

export const selectAllLevels = selectAll

export const selectAllLevelIds = selectIds;

export const selectAllLevelEntities = selectEntities;

export const selectTotalLevels = selectTotal;

export const selectLevelById = (id: string) => createSelector(
    selectAllLevelEntities,
    (entities) => entities[id] || null
);

export const selectSelectedLevel = createSelector(
    selectAllLevelEntities,
    selectSelectedLevelId,
    (entities, selectedId) => entities[selectedId ?? ''] || null
);

export const selectLevelsLoading = createSelector(
    selectLoading,
    (loading) => loading
);

export const selectLevelUpdateLoading = createSelector(
    selectLoadingUpdate,
    (loading) => loading
);

export const selectLevelCreateLoading = createSelector(
    selectLoadingCreate,
    (loading) => loading
);

export const selectLevelDeleteLoading = createSelector(
    selectLoadingDelete,
    (loading) => loading
);


export const selectLevelError = createSelector(
    selectError,
    (error) => error
);


export const selectLevelUpdateError = createSelector(
    selectUpdateError,
    (error) => error
);


export const selectLevelCreateError = createSelector(
    selectCreateError,
    (error) => error
);


export const selectLevelDeleteError = createSelector(
    selectDeleteError,
    (error) => error
);

export const selectLevelByName = (name: string) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).find(level => level?.name.toLowerCase() === name.toLowerCase()) || null
);

export const selectLevelsByIds = (ids: string[]) => createSelector(
    selectAllLevelEntities,
    (entities) => ids.map(id => entities[id]).filter(level => level !== undefined)
);


export const selectLevelsByName = (name: string) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).filter(level => level?.name.toLowerCase().includes(name.toLowerCase()))
);

export const selectLevelsByDescription = (description: string) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).filter(level => level?.description?.toLowerCase().includes(description.toLowerCase()))
);

export const selectLevelsByDuration = (duration: number) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).filter(level => level?.duration === duration)
);

export const selectLevelsByMaximumUnits = (maximumUnits: number) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).filter(level => level?.maximumUnits === maximumUnits)
);


export const selectLevelsByLevelId = (levelId: string) => createSelector(
    selectAllLevelEntities,
    (entities) => Object.values(entities).filter(level => level?.id === levelId)
);
