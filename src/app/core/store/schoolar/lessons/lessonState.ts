import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Lesson} from "../../../models/academic/lesson";

export interface LessonState extends EntityState<Lesson> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    // Error states
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    bulkError: string | null;

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

export const lessonsInitialState: LessonState = lessonsAdapter.getInitialState({
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    bulkError: null,
    selectedLessonId: null,
    lastFetch: null,
    cacheExpired: false,
    searchDebounceTimer: null
});
