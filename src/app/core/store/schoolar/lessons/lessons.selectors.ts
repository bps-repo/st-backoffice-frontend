import {lessonsFeature} from "./lessons.feature";
import {lessonsAdapter} from "./lessonState";
import {createSelector} from "@ngrx/store";


export const {
    selectLessonsState,
    selectLoading: selectLoadingLessons,
    selectSelectedLessonId,
    selectError,
    selectLoadingCreate,
    selectLastFetch,
    selectCacheExpired,
    selectLoadingDelete,
    selectLoadingUpdate,
    selectSearchDebounceTimer
} = lessonsFeature;


const {
    selectEntities,
    selectAll,
    selectIds,
    selectTotal
} = lessonsAdapter.getSelectors(lessonsFeature.selectLessonsState)


export const selectAllLessons = createSelector(
    selectAll,
    (lessons) => lessons
);


