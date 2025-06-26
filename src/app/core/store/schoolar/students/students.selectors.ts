import {isCacheValid, studentsAdapter} from "./student.state";
import {studentsFeature} from "./students.reducers";
import {createSelector} from "@ngrx/store";

export const {
    name,
    reducer,
    selectLoading,
    selectCreateStudentSuccess,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLoadingBulk,
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectBulkError,
    selectSelectedStudentId,
    selectFilters,
    selectPagination,
    selectLastFetch,
    selectCacheExpired,
    selectBulkOperationInProgress,
    selectSelectedStudentIds,
    selectSortBy,
    selectSortDirection,
    selectIds
} = studentsFeature;

const {
    selectEntities,
    selectAll,
    selectTotal,
} = studentsAdapter.getSelectors(studentsFeature.selectStudentsState)

export const selectAllStudents = createSelector(
    selectAll,
    (students) => students
);

export const selectStudentEntities = createSelector(
    selectEntities,
    (entities) => entities
);

export const selectStudentIds = selectIds;

export const selectTotalStudents = selectTotal;

// Error selectors
export const selectStudentAnyError = createSelector(
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectBulkError,
    (error, createError, updateError, deleteError, bulkError) =>
        error || createError || updateError || deleteError || bulkError
);

export const selectStudentAllErrors = createSelector(
    selectError,
    selectCreateError,
    selectUpdateError,
    selectDeleteError,
    selectBulkError,
    (error, createError, updateError, deleteError, bulkError) => ({
        general: error,
        create: createError,
        update: updateError,
        delete: deleteError,
        bulk: bulkError
    })
);


// Loading selectors
export const selectStudentAnyLoading = createSelector(
    selectLoading,
    selectLoadingCreate,
    selectLoadingUpdate,
    selectLoadingDelete,
    selectLoadingBulk,
    (loading, loadingCreate, loadingUpdate, loadingDelete, loadingBulk) =>
        loading || loadingCreate || loadingUpdate || loadingDelete || loadingBulk
);


// Filtered students selector
export const selectFilteredStudents = createSelector(
    selectAllStudents,
    selectFilters,
    (students, filters) => {
        if (!students.length) return students;

        return students.filter(student => {
            // Search term filter
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    student.user.firstName?.toLowerCase().includes(searchLower) ||
                    student.user.email?.toLowerCase().includes(searchLower) ||
                    student.id?.toLowerCase().includes(searchLower);

                if (!matchesSearch) return false;
            }

            // Status filter
            // if (filters.status && filters.status !== 'ALL') {
            //     if (student.status !== filters.status) return false;
            // }

            // Level filter
            // if (filters.levelId) {
            //     if (student.levelId !== filters.levelId) return false;
            // }

            // Class filter
            // if (filters.classId) {
            //     if (student.classId !== filters.classId) return false;
            // }

            // Date range filter
            if (filters.enrollmentDateRange.start || filters.enrollmentDateRange.end) {
                const enrollmentDate = new Date(student.createdAt || 0);

                if (filters.enrollmentDateRange.start) {
                    const startDate = new Date(filters.enrollmentDateRange.start);
                    if (enrollmentDate < startDate) return false;
                }

                if (filters.enrollmentDateRange.end) {
                    const endDate = new Date(filters.enrollmentDateRange.end);
                    if (enrollmentDate > endDate) return false;
                }
            }

            return true;
        });
    }
);

export const selectPaginatedStudents = createSelector(
    selectFilteredStudents,
    selectPagination,
    (students, pagination) => {
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return students.slice(startIndex, endIndex);
    }
);

// Bulk selection selectors
export const selectSelectedStudents = createSelector(
    selectStudentEntities,
    selectSelectedStudentIds,
    (entities, selectedIds) => selectedIds.map(id => entities[id]).filter(Boolean)
);

export const selectIsAllSelected = createSelector(
    selectPaginatedStudents,
    selectSelectedStudentIds,
    (paginatedStudents, selectedIds) =>
        paginatedStudents.length > 0 &&
        paginatedStudents.every(student => selectedIds.includes(student.id || ''))
);

// Cache selectors
export const selectShouldRefreshCache = createSelector(
    selectLastFetch,
    selectCacheExpired,
    (lastFetch, cacheExpired) =>
        !lastFetch || cacheExpired || !isCacheValid(lastFetch)
);


export const selectSelectedStudent = createSelector(
    selectStudentEntities,
    selectSelectedStudentId,
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Utility selector functions
export const selectStudentById = (id: string) => createSelector(
    selectStudentEntities,
    (entities) => entities[id] || null
);

export const selectStudentsByIds = (ids: string[]) => createSelector(
    selectStudentEntities,
    (entities) => ids.map(id => entities[id]).filter(Boolean)
);

export const selectStudentsError = selectError;

export const selectStudentsLoading = selectLoading;

export function selectStudents(state: any) {
    return selectAll(state);
}

export function selectStudent(id: string) {
    return (state: any) => selectEntities(state)[id];
}
