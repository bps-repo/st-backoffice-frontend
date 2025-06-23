import {lessonsFeature} from "./lessons.reducers";
import {lessonsAdapter} from "./lessons.state";
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


