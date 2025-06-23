import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Lesson} from "../../../models/academic/lesson";

export interface LessonsState extends EntityState<Lesson> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    // Error states
    error: string | null;

    // Selection state
    selectedLessonId: string | null;

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;

    // UI state
    searchDebounceTimer: any;
}

export const lessonsAdapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
    selectId: (lesson: Lesson) => lesson.id || '',
    sortComparer: false
});

export const lessonsInitialState: LessonsState = {
    ids: [],
    entities: {},
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    selectedLessonId: null,
    lastFetch: null,
    cacheExpired: false,
    searchDebounceTimer: null
};
