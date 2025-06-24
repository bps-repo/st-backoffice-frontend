import {classesFeature} from "./classes.feature";
import {classAdapter} from "./classState";
import {selectSelectedLessonId} from "../lessons/lessons.selectors";
import {createSelector} from "@ngrx/store";

export const {
    selectLoadingUpdate,
    selectLoadingCreate,
    selectDeleteError,
    selectCreateError,
    selectUpdateError,
    selectSelectedClassId,
    selectErrors,
    selectBulkError,
    selectLoading,
    selectLoadingDelete,
} = classesFeature;

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal
} = classAdapter.getSelectors(classesFeature.selectClassesState)

export const selectAllClasses = createSelector(
    selectAll,
    (classes,) => classes
)

export const selectClassesEntities = createSelector(
    selectEntities,
    (classes) => classes
)

export const selectClassesIds = createSelector(
    selectIds,
    (ids) => ids
)

export const selectSelectedClass = createSelector(
    selectSelectedClassId,
    selectClassesEntities,
    (selectedClassId, classes) => selectedClassId ? classes[selectedClassId] : null
);


export const selectClassesTotal = createSelector(
    selectTotal,
    (total) => total
);

export const selectClassesLoading = createSelector(
    selectLoading,
    (loading) => loading
);

export const selectClassesError = createSelector(
    selectErrors,
    (errors) => errors
);

export const selectClassesBulkError = createSelector(
    selectBulkError,
    (bulkError) => bulkError
);

export const selectClassesLoadingCreate = createSelector(
    selectLoadingCreate,
    (loadingCreate) => loadingCreate
);

export const selectClassesLoadingUpdate = createSelector(
    selectLoadingUpdate,
    (loadingUpdate) => loadingUpdate
);


export const selectClassesLoadingDelete = createSelector(
    selectLoadingDelete,
    (loadingDelete) => loadingDelete
);

export const selectClassesDeleteError = createSelector(
    selectDeleteError,
    (deleteError) => deleteError
);


export const selectClassesCreateError = createSelector(
    selectCreateError,
    (createError) => createError
);

export const selectClassesUpdateError = createSelector(
    selectUpdateError,
    (updateError) => updateError
);

export const selectClassesState = createSelector(
    classesFeature.selectClassesState,
    (state) => state
);
