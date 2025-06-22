import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Student} from "../../../models/academic/student";

// 1. CORRECTED STATE INTERFACE - Remove redundant 'students' array
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

// 2. SUPPORTING INTERFACES
export interface StudentFilters {
    searchTerm: string;
    status: 'ALL' | 'ACTIVE' | 'INACTIVE';
    levelId: string | null;
    classId: string | null;
    enrollmentDateRange: {
        start: Date | null;
        end: Date | null;
    };
}

export interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// 3. IMPROVED ENTITY ADAPTER CONFIGURATION
export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>({
    // Use non-null assertion operator carefully or provide default
    selectId: (student: Student) => student.id!,

    // Provide proper sorting for better UX
    sortComparer: (a: Student, b: Student) => {
        const lastNameCompare = a.user?.lastName.localeCompare(b.user?.lastName!)!;
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.user?.firstName.localeCompare(b.user?.firstName!)!;
    }
});

// 4. COMPREHENSIVE INITIAL STATE
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
        totalItems: 0,
        totalPages: 0
    },

    // Cache
    lastFetch: null,

    // Bulk operations
    bulkOperationInProgress: false,
    selectedStudentIds: []
});


// export const studentsAdapterByProgress: EntityAdapter<Student> = createEntityAdapter<Student>({
//     selectId: (student: Student) => student.id,
//     sortComparer: (a: Student, b: Student) => {
//         return b.levelProgressPercentage - a.levelProgressPercentage;
//     }
// });

// 6. TYPED ENTITY OPERATIONS HELPER
export class StudentEntityOperations {
    constructor(private adapter: EntityAdapter<Student>) {
    }

    // Safe entity operations with proper typing
    addStudent(state: StudentsState, student: Student): StudentsState {
        return this.adapter.addOne(student, {
            ...state,
            loading: false,
            error: null
        });
    }

    updateStudent(state: StudentsState, update: { id: string; changes: Partial<Student> }): StudentsState {
        return this.adapter.updateOne(update, {
            ...state,
            loadingUpdate: false,
            updateError: null
        });
    }

    removeStudent(state: StudentsState, id: string): StudentsState {
        return this.adapter.removeOne(id, {
            ...state,
            loadingDelete: false,
            deleteError: null,
            selectedStudentId: state.selectedStudentId === id ? null : state.selectedStudentId
        });
    }

    loadStudents(state: StudentsState, students: Student[]): StudentsState {
        return this.adapter.setAll(students, {
            ...state,
            loading: false,
            error: null,
            lastFetch: Date.now()
        });
    }

    // Bulk operations
    addMultipleStudents(state: StudentsState, students: Student[]): StudentsState {
        return this.adapter.addMany(students, {
            ...state,
            bulkOperationInProgress: false,
            error: null
        });
    }

    updateMultipleStudents(state: StudentsState, updates: { id: string; changes: Partial<Student> }[]): StudentsState {
        return this.adapter.updateMany(updates, {
            ...state,
            bulkOperationInProgress: false,
            updateError: null
        });
    }

    removeMultipleStudents(state: StudentsState, ids: string[]): StudentsState {
        return this.adapter.removeMany(ids, {
            ...state,
            bulkOperationInProgress: false,
            deleteError: null,
            selectedStudentIds: state.selectedStudentIds.filter(id => !ids.includes(id))
        });
    }
}

// 7. ENTITY ADAPTER WITH VALIDATION
export const createValidatedStudentAdapter = () => {
    return createEntityAdapter<Student>({
        selectId: (student: Student) => {
            if (!student.id) {
                throw new Error('Student must have an ID');
            }
            return student.id;
        },
        sortComparer: (a: Student, b: Student) => {
            // Validate student data before sorting
            if (!a.user || !b.user) {
                console.warn('Student missing user data');
                return 0;
            }
            return a.user.lastName.localeCompare(b.user.lastName);
        }
    });
};

// 8. CACHE MANAGEMENT HELPERS
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
};
