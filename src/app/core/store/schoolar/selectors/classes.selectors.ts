// Create selectors
import {classesAdapter, classesFeature} from "../reducers/classes.reducers";

export const {
    selectClassesState,
    selectLoading: selectLoadingClass,
    selectError: selectClassesError,
    selectSelectedClassId,
} = classesFeature;

// Additional selectors
const { selectIds, selectEntities, selectAll, selectTotal } = classesAdapter.getSelectors(selectClassesState);

export const selectAllClasses = selectAll;
export const selectClassEntities = selectEntities;
export const selectSelectedClass = (state: any) => {
    const selectedId = selectSelectedClassId(state);
    return selectedId ? selectClassEntities(state)[selectedId] : null;
};
