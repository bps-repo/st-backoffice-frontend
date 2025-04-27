import { StudentsEffects } from './effects/students.effects';
import { ClassesEffects } from './effects/classes.effects';
import {
  studentsFeature,
  selectAllStudents,
  selectStudentEntities,
  selectSelectedStudent
} from './reducers/students.reducers';
import {
  classesFeature,
  selectAllClasses,
  selectClassEntities,
  selectSelectedClass
} from './reducers/classes.reducers';

/**
 * All effects for the schoolar feature
 */
export const scholarEffects = [
  StudentsEffects,
  ClassesEffects,
];

/**
 * @deprecated Use provideState() with feature objects instead
 */
export const scholarReducers = {
  [studentsFeature.name]: studentsFeature.reducer,
  [classesFeature.name]: classesFeature.reducer,
};

// Re-export all the actions, reducers, and state
export * from './actions/students.actions';
export * from './actions/classes.actions';
export * from './reducers/students.reducers';
export * from './reducers/classes.reducers';
export * from './schoolar.state';

// Export entity selectors
export {
  selectAllStudents,
  selectStudentEntities,
  selectSelectedStudent,
  selectAllClasses,
  selectClassEntities,
  selectSelectedClass
};
