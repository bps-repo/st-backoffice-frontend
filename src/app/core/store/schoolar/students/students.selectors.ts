import {studentsAdapter} from "./students.state";
import {studentsFeature} from "./students.reducers";

export const {
    name,
    reducer,
    selectLoading,
    selectError,
} = studentsFeature;

const {
    selectEntities,
    selectAll,
    selectTotal,
    selectIds,
} = studentsAdapter.getSelectors();

export const selectAllStudents = selectAll;

export const selectStudentEntities = selectEntities;

export const selectStudentIds = selectIds;

export const selectTotalStudents = selectTotal;

export const selectStudentsError = selectError;

export const selectStudentsLoading = selectLoading;

export function selectStudents(state: any) {
    return selectAll(state);
}

export function selectStudent(id: string) {
    return (state: any) => selectEntities(state)[id];
}
