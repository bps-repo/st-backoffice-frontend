import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Student} from "../../../models/academic/student";
import {PaginationState, StudentFilters} from "./@types/students.state.interface";

export interface StudentState extends EntityState<Student> {
    // Loading states
    loading: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;
    loadingBulk: boolean;
    loadingPhoto: boolean;
    loadingAddToClass: boolean;
    loadingRemoveFromClass: boolean;

    // Error states
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    bulkError: string | null;
    photoError: string | null;
    addToClassError: string | null;
    removeFromClassError: string | null;

    // Selection state
    selectedStudentId: string | null;

    // Filters and pagination
    filters: StudentFilters;
    pagination: PaginationState;

    // Cache management
    lastFetch: number | null;
    cacheExpired: boolean;

    // Bulk operations
    bulkOperationInProgress: boolean;
    selectedStudentIds: string[];

    // UI state
    searchDebounceTimer: any;
    sortBy: string | null;
    sortDirection: 'asc' | 'desc';
}

export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>({
    selectId: (student: Student) => student.id || '',
    sortComparer: (a: Student, b: Student) => {
        // Default sort by name, then by created date
        const nameComparison = (a.user.firstName || '').localeCompare(b.user.firstName || '');
        if (nameComparison !== 0) return nameComparison;

        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Most recent first
    }
});

export const initialStudentsState: StudentState = studentsAdapter.getInitialState({
    // Loading states
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingBulk: false,
    loadingPhoto: false,
    loadingAddToClass: false,
    loadingRemoveFromClass: false,

    // Error states
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    bulkError: null,
    photoError: null,
    addToClassError: null,
    removeFromClassError: null,

    // Selection
    selectedStudentId: null,

    // Filters
    filters: {
        searchTerm: '',
        status: 'ALL',
        levelId: null,
        classId: null,
        enrollmentDateRange: {
            start: null,
            end: null
        }
    },

    // Pagination
    pagination: {
        currentPage: 0,
        pageSize: 15,
        pageIndex: 0,
        totalItems: 0,
        totalPages: 0
    },

    // Cache
    lastFetch: null,
    cacheExpired: false,

    // Bulk operations
    bulkOperationInProgress: false,
    selectedStudentIds: [],

    // UI state
    searchDebounceTimer: null,
    sortBy: null,
    sortDirection: 'asc'
});

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const SEARCH_DEBOUNCE_TIME = 300;


export const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
};

export const shouldRefreshCache = (state: StudentState): boolean => {
    return !state.lastFetch || state.cacheExpired || !isCacheValid(state.lastFetch);
};
