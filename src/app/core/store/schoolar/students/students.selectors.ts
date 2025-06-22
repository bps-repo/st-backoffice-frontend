import {studentsAdapter} from "./students.state";
import {studentsFeature} from "./students.reducers";


export const {
    name,
    reducer,
    selectStudentsState,
    selectLoading,
    selectError,
    selectIds,
    selectStudents
} = studentsFeature;

// Additional selectors
const {selectEntities, selectAll, selectTotal} = studentsAdapter.getSelectors(selectStudentsState);

export const selectAllStudents = selectStudents;
export const selectStudentEntities = selectEntities;
export const selectSelectedStudent = (state: any) => {
    const selectedId = selectStudents(state);
    return null;
};

export const selectStudentIds = selectIds;

export const selectTotalStudents = selectTotal;

export const selectStudentsError = selectError;

export const selectStudentsLoading = selectLoading;
