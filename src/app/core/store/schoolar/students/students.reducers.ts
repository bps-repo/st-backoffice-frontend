import {createFeature, createReducer, on} from '@ngrx/store';
import {STUDENT_FEATURE_KEY, StudentsActions} from "./students.actions";
import {initialStudentsState, studentsAdapter, StudentState} from "./student.state";

// Create feature
export const studentsFeature = createFeature({
    name: STUDENT_FEATURE_KEY,
    reducer: createReducer(
        initialStudentsState,

        // Load students
        on(StudentsActions.loadStudents, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),

        on(StudentsActions.loadStudentsSuccess, (state, {students, pagination}) =>
            studentsAdapter.setAll(students, {
                ...state,
                loading: false,
                error: null,
                lastFetch: Date.now(),
                cacheExpired: false,
                pagination: pagination || state.pagination,
            })
        ),

        on(StudentsActions.loadStudentsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Search students
        on(StudentsActions.searchStudents, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),

        on(StudentsActions.searchStudentsSuccess, (state, {students}) =>
            studentsAdapter.setAll(students, {
                ...state,
                loading: false,
                error: null,
                lastFetch: Date.now(),
                cacheExpired: false,
            })
        ),

        on(StudentsActions.searchStudentsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load single student
        on(StudentsActions.loadStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),

        on(StudentsActions.loadStudentSuccess, (state, {student}) =>
            studentsAdapter.upsertOne(student, {
                ...state,
                selectedStudentId: student.id || null,
                loading: false,
                error: null,
            })
        ),

        on(StudentsActions.loadStudentFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Create student
        on(StudentsActions.createStudent, (state) => ({
            ...state,
            loadingCreate: true,
            createError: null,
            createStudentSuccess: false,
            selectCreatedStudent: null
        })),

        on(StudentsActions.createStudentSuccess, (state, {student}) =>
            studentsAdapter.addOne(student, {
                ...state,
                loadingCreate: false,
                createError: null,
                createStudentSuccess: true,
                selectCreatedStudent: student,
                // Update pagination totals
                pagination: {
                    ...state.pagination,
                    totalItems: state.pagination.totalItems + 1,
                    totalPages: Math.ceil((state.pagination.totalItems + 1) / state.pagination.pageSize)
                }
            })
        ),

        on(StudentsActions.createStudentFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            createError: error,
            createStudentSuccess: false,
            selectCreatedStudent: null
        })),

        // Create student with request
        on(StudentsActions.createStudentWithRequest, (state) => ({
            ...state,
            loadingCreate: true,
            createError: null,
            createStudentSuccess: false,
            selectCreatedStudent: null,
        })),

        on(StudentsActions.createStudentWithRequestSuccess, (state, {student}) =>
            studentsAdapter.addOne(student, {
                ...state,
                loadingCreate: false,
                createError: null,
                createStudentSuccess: true,
                selectCreatedStudent: student,
                // Update pagination totals
                pagination: {
                    ...state.pagination,
                    totalItems: state.pagination.totalItems + 1,
                    totalPages: Math.ceil((state.pagination.totalItems + 1) / state.pagination.pageSize)
                }
            })
        ),

        on(StudentsActions.createStudentWithRequestFailure, (state, {error}) => ({
            ...state,
            loadingCreate: false,
            createError: error,
            createStudentSuccess: false,
            selectCreatedStudent: null,
        })),

        // Update student
        on(StudentsActions.updateStudent, (state) => ({
            ...state,
            loadingUpdate: true,
            updateError: null,
        })),

        on(StudentsActions.updateStudentSuccess, (state, {student}) =>
            studentsAdapter.updateOne(
                {id: student.id!, changes: student},
                {
                    ...state,
                    loadingUpdate: false,
                    updateError: null,
                }
            )
        ),

        on(StudentsActions.updateStudentFailure, (state, {error}) => ({
            ...state,
            loadingUpdate: false,
            updateError: error,
        })),

        // Delete student
        on(StudentsActions.deleteStudent, (state) => ({
            ...state,
            loadingDelete: true,
            deleteError: null,
        })),

        on(StudentsActions.deleteStudentSuccess, (state, {id}) =>
            studentsAdapter.removeOne(id, {
                ...state,
                loadingDelete: false,
                deleteError: null,
                selectedStudentId: state.selectedStudentId === id ? null : state.selectedStudentId,
                selectedStudentIds: state.selectedStudentIds.filter(selectedId => selectedId !== id),
                // Update pagination totals
                pagination: {
                    ...state.pagination,
                    totalItems: Math.max(0, state.pagination.totalItems - 1),
                    totalPages: Math.ceil(Math.max(0, state.pagination.totalItems - 1) / state.pagination.pageSize)
                }
            })
        ),

        on(StudentsActions.deleteStudentFailure, (state, {error}) => ({
            ...state,
            loadingDelete: false,
            deleteError: error,
        })),

        // Create student photo
        on(StudentsActions.createStudentPhoto, (state) => ({
            ...state,
            loadingPhoto: true,
            photoError: null,
        })),

        on(StudentsActions.createStudentPhotoSuccess, (state, {response}) => ({
            ...state,
            loadingPhoto: false,
            photoError: null,
        })),

        on(StudentsActions.createStudentPhotoFailure, (state, {error}) => ({
            ...state,
            loadingPhoto: false,
            photoError: error,
        })),

        // Add student to class
        on(StudentsActions.addStudentToClass, (state) => ({
            ...state,
            loadingAddToClass: true,
            addToClassError: null,
        })),

        on(StudentsActions.addStudentToClassSuccess, (state, {response}) => ({
            ...state,
            loadingAddToClass: false,
            addToClassError: null,
        })),

        on(StudentsActions.addStudentToClassFailure, (state, {error}) => ({
            ...state,
            loadingAddToClass: false,
            addToClassError: error,
        })),

        // Remove student from class
        on(StudentsActions.removeStudentFromClass, (state) => ({
            ...state,
            loadingRemoveFromClass: true,
            removeFromClassError: null,
        })),

        on(StudentsActions.removeStudentFromClassSuccess, (state, {response}) => ({
            ...state,
            loadingRemoveFromClass: false,
            removeFromClassError: null,
        })),

        on(StudentsActions.removeStudentFromClassFailure, (state, {error}) => ({
            ...state,
            loadingRemoveFromClass: false,
            removeFromClassError: error,
        })),

        // Bulk operations
        on(StudentsActions.bulkDeleteStudents, (state) => ({
            ...state,
            loadingBulk: true,
            bulkOperationInProgress: true,
            bulkError: null,
        })),

        on(StudentsActions.bulkDeleteStudentsSuccess, (state, {ids}) =>
            studentsAdapter.removeMany(ids, {
                ...state,
                loadingBulk: false,
                bulkOperationInProgress: false,
                bulkError: null,
                selectedStudentIds: [],
                selectedStudentId: ids.includes(state.selectedStudentId || '') ? null : state.selectedStudentId,
                pagination: {
                    ...state.pagination,
                    totalItems: Math.max(0, state.pagination.totalItems - ids.length),
                    totalPages: Math.ceil(Math.max(0, state.pagination.totalItems - ids.length) / state.pagination.pageSize)
                }
            })
        ),

        on(StudentsActions.bulkDeleteStudentsFailure, (state, {error}) => ({
            ...state,
            loadingBulk: false,
            bulkOperationInProgress: false,
            bulkError: error,
        })),

        // Selection management
        on(StudentsActions.selectStudent, (state, {id}) => ({
            ...state,
            selectedStudentId: id,
        })),

        on(StudentsActions.clearSelection, (state) => ({
            ...state,
            selectedStudentId: null,
            selectedStudent: null,
            createStudentSuccess: false,
            selectCreatedStudent: null,
            updateStudentSuccess: false,
            selectUpdatedStudent: null,
            deleteStudentSuccess: false,
            selectDeletedStudent: null,
            selectedStudentIds: [],
        })),

        on(StudentsActions.toggleStudentSelection, (state, {id}) => ({
            ...state,
            selectedStudentIds: state.selectedStudentIds.includes(id)
                ? state.selectedStudentIds.filter(selectedId => selectedId !== id)
                : [...state.selectedStudentIds, id]
        })),

        on(StudentsActions.selectAllStudents, (state, {ids}) => ({
            ...state,
            selectedStudentIds: ids,
        })),

        // Filter management
        on(StudentsActions.updateFilters, (state, {filters}) => ({
            ...state,
            filters: {...state.filters, ...filters},
            pagination: {...state.pagination, pageIndex: 0, currentPage: 0}, // Reset to first page
        })),

        on(StudentsActions.clearFilters, (state) => ({
            ...state,
            filters: initialStudentsState.filters,
            pagination: {...state.pagination, pageIndex: 0, currentPage: 0},
        })),

        // Pagination
        on(StudentsActions.updatePagination, (state, {pagination}) => ({
            ...state,
            pagination: {...state.pagination, ...pagination},
        })),

        // Cache management
        on(StudentsActions.refreshCache, (state) => ({
            ...state,
            cacheExpired: true,
        })),

        on(StudentsActions.clearCache, (state) =>
            studentsAdapter.removeAll({
                ...state,
                lastFetch: null,
                cacheExpired: false,
            })
        ),

        // Error management
        on(StudentsActions.clearError, (state, {errorType}) => {
            const updates: Partial<StudentState> = {};

            if (!errorType || errorType === 'general') updates.error = null;
            if (!errorType || errorType === 'create') updates.createError = null;
            if (!errorType || errorType === 'update') updates.updateError = null;
            if (!errorType || errorType === 'delete') updates.deleteError = null;
            if (!errorType || errorType === 'bulk') updates.bulkError = null;
            if (!errorType || errorType === 'photo') updates.photoError = null;
            if (!errorType || errorType === 'addToClass') updates.addToClassError = null;
            if (!errorType || errorType === 'removeFromClass') updates.removeFromClassError = null;

            return {...state, ...updates};
        }),

        on(StudentsActions.clearAllErrors, (state) => ({
            ...state,
            error: null,
            createError: null,
            updateError: null,
            deleteError: null,
            bulkError: null,
            photoError: null,
            addToClassError: null,
            removeFromClassError: null,
        })),

        // Sorting
        on(StudentsActions.updateSort, (state, {sortBy, sortDirection}) => ({
            ...state,
            sortBy,
            sortDirection,
        }))
    ),
});

export const {name, reducer} = studentsFeature;
