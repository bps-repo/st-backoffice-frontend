import { createFeature, createReducer, on } from '@ngrx/store';
import { ClassesState } from '../schoolar.state';
import { classesActions } from '../actions/classes.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Class } from 'src/app/core/models/academic/class';

// Create entity adapter
export const classesAdapter: EntityAdapter<Class> = createEntityAdapter<Class>({
  selectId: (classItem: Class) => classItem.id,
  sortComparer: (a: Class, b: Class) => a.name.localeCompare(b.name),
});

// Initial state
export const classesInitialState: ClassesState = classesAdapter.getInitialState({
  selectedClassId: null,
  loading: false,
  error: null,
});

// Create feature
export const classesFeature = createFeature({
  name: 'classes',
  reducer: createReducer(
    classesInitialState,
    // Load classes
    on(classesActions.loadClasses, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(classesActions.loadClassesSuccess, (state, { classes }) =>
      classesAdapter.setAll(classes, {
        ...state,
        loading: false,
      })
    ),
    on(classesActions.loadClassesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Load class
    on(classesActions.loadClass, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(classesActions.loadClassSuccess, (state, { class: classItem }) =>
      classesAdapter.upsertOne(classItem, {
        ...state,
        selectedClassId: classItem.id,
        loading: false,
      })
    ),
    on(classesActions.loadClassFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create class
    on(classesActions.createClass, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(classesActions.createClassSuccess, (state, { class: classItem }) =>
      classesAdapter.addOne(classItem, {
        ...state,
        loading: false,
      })
    ),
    on(classesActions.createClassFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Update class
    on(classesActions.updateClass, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(classesActions.updateClassSuccess, (state, { class: classItem }) =>
      classesAdapter.updateOne(
        { id: classItem.id, changes: classItem },
        {
          ...state,
          loading: false,
        }
      )
    ),
    on(classesActions.updateClassFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Delete class
    on(classesActions.deleteClass, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(classesActions.deleteClassSuccess, (state, { id }) =>
      classesAdapter.removeOne(id, {
        ...state,
        selectedClassId: state.selectedClassId === id ? null : state.selectedClassId,
        loading: false,
      })
    ),
    on(classesActions.deleteClassFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Clear error
    on(classesActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

// Create selectors
export const {
  selectClassesState,
  selectLoading: selectLoadingClass,
  selectError: selectClassesError,
  selectSelectedClassId,
} = classesFeature;

// Additional selectors
const { selectIds, selectEntities, selectAll, selectTotal } = classesAdapter.getSelectors(selectClassesState);

export const selectAllClasses = selectAll;
export const selectClassEntities = selectEntities;
export const selectSelectedClass = (state: any) => {
  const selectedId = selectSelectedClassId(state);
  return selectedId ? selectClassEntities(state)[selectedId] : null;
};
