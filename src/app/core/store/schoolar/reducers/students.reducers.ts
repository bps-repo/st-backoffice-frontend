import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentsState } from '../schoolar.state';
import { studentsActions } from '../actions/students.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Student } from 'src/app/core/models/academic/student';

// Create entity adapter
export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>({
  selectId: (student: Student) => student.id!,
  sortComparer: (a: Student, b: Student) => a.name.localeCompare(b.name),
});

// Initial state
export const initialState: StudentsState = studentsAdapter.getInitialState({
  selectedStudentId: null,
  loading: false,
  error: null,
});

// Create feature
export const studentsFeature = createFeature({
  name: 'students',
  reducer: createReducer(
    initialState,
    // Load students
    on(studentsActions.loadStudents, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(studentsActions.loadStudentsSuccess, (state, { students }) =>
      studentsAdapter.setAll(students, {
        ...state,
        loading: false,
      })
    ),
    on(studentsActions.loadStudentsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Load student
    on(studentsActions.loadStudent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(studentsActions.loadStudentSuccess, (state, { student }) =>
      studentsAdapter.upsertOne(student, {
        ...state,
        selectedStudentId: student.id!,
        loading: false,
      })
    ),
    on(studentsActions.loadStudentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create student
    on(studentsActions.createStudent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(studentsActions.createStudentSuccess, (state, { student }) =>
      studentsAdapter.addOne(student, {
        ...state,
        loading: false,
      })
    ),
    on(studentsActions.createStudentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Update student
    on(studentsActions.updateStudent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(studentsActions.updateStudentSuccess, (state, { student }) =>
      studentsAdapter.updateOne(
        { id: student.id!, changes: student },
        {
          ...state,
          loading: false,
        }
      )
    ),
    on(studentsActions.updateStudentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Delete student
    on(studentsActions.deleteStudent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(studentsActions.deleteStudentSuccess, (state, { id }) =>
      studentsAdapter.removeOne(id, {
        ...state,
        selectedStudentId: state.selectedStudentId === id ? null : state.selectedStudentId,
        loading: false,
      })
    ),
    on(studentsActions.deleteStudentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Clear error
    on(studentsActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

// Create selectors
export const {
  name,
  reducer,
  selectStudentsState,
  selectLoading,
  selectError,
  selectSelectedStudentId,
} = studentsFeature;

// Additional selectors
const { selectIds, selectEntities, selectAll, selectTotal } = studentsAdapter.getSelectors(selectStudentsState);

export const selectAllStudents = selectAll;
export const selectStudentEntities = selectEntities;
export const selectSelectedStudent = (state: any) => {
  const selectedId = selectSelectedStudentId(state);
  return selectedId ? selectStudentEntities(state)[selectedId] : null;
};
