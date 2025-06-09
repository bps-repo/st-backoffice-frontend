// Create selectors
import {lessonsAdapter, classesFeature} from "../reducers/classes.reducers";

export const {
    selectLessonsState,
    selectLoading: selectLoadingClass,
    selectError: selectClassesError,
    selectSelectedLessonId,
} = classesFeature;

const {selectIds, selectEntities, selectAll, selectTotal} = lessonsAdapter.getSelectors(selectLessonsState);

export const selectAllClasses = selectAll;
export const selectClassEntities = selectEntities;
export const selectSelectedClass = (state: any) => {
    const selectedId = selectSelectedLessonId(state);
    return selectedId ? selectClassEntities(state)[selectedId] : null;
};
