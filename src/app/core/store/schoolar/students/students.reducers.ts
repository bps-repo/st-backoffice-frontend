import {createFeature, createReducer, on} from '@ngrx/store';
import {STUDENT_FEATURE_KEY, StudentsActions} from "./studentsActions";
import {initialState, studentsAdapter} from "./students.state";

// Create feature
export const studentsFeature = createFeature({
    name: STUDENT_FEATURE_KEY,
    reducer: createReducer(
        initialState,
        // Load students
        on(StudentsActions.loadStudents, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),

        on(StudentsActions.loadStudentsSuccess, (state, {students}) => ({
            ...state,
            students,
            loading: false,
            error: null,
        })),
        on(StudentsActions.loadStudentsFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load student
        on(StudentsActions.loadStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(StudentsActions.loadStudentSuccess, (state, {student}) =>
            studentsAdapter.upsertOne(student, {
                ...state,
                selectedStudentId: student.id!,
                loading: false,
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
            loading: true,
            error: null,
        })),
        on(StudentsActions.createStudentSuccess, (state, {student}) =>
            studentsAdapter.addOne(student, {
                ...state,
                loading: false,
            })
        ),
        on(StudentsActions.createStudentFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Update student
        on(StudentsActions.updateStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(StudentsActions.updateStudentSuccess, (state, {student}) =>
            studentsAdapter.updateOne(
                {id: student.id!, changes: student},
                {
                    ...state,
                    loading: false,
                }
            )
        ),
        on(StudentsActions.updateStudentFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Delete student
        on(StudentsActions.deleteStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(StudentsActions.deleteStudentSuccess, (state, {id}) =>
            studentsAdapter.removeOne(id, {
                ...state,
            })
        ),
        on(StudentsActions.deleteStudentFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Clear error
        on(StudentsActions.clearError, (state) => ({
            ...state,
            error: null,
        }))
    ),
});
