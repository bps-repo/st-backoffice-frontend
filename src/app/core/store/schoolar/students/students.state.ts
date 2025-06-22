import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Student} from "../../../models/academic/student";
import {PaginationState, StudentFilters} from "./@types/students.state.interface";

export interface StudentsState extends EntityState<Student> {

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

    // Selection state
    selectedStudentId: string | null;

    // Filters and pagination
    filters: StudentFilters;
    pagination: PaginationState;

    // Cache management
    lastFetch: number | null;

    // Bulk operations
    bulkOperationInProgress: boolean;
    selectedStudentIds: string[];
}

export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>({
    // Use non-null assertion operator carefully or provide default
    selectId: (student: Student) => student.id!,

    // Provide proper sorting for better UX
    sortComparer: false
});

export const initialStudentsState: StudentsState = studentsAdapter.getInitialState({
    // Loading states
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,

    // Error states
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,

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

    // Bulk operations
    bulkOperationInProgress: false,
    selectedStudentIds: []
});

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
};
