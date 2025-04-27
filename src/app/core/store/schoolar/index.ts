import { StudentsEffects } from './effects/students.effects';
import { LessonsEffects } from './effects/lessons.effects';
import { CertificatesEffects } from './effects/certificates.effects';
import {
  studentsFeature,
  selectAllStudents,
  selectStudentEntities,
  selectSelectedStudent
} from './reducers/students.reducers';
import {
  classesFeature,
} from './reducers/classes.reducers';
import {
  examsFeature,
  selectSelectedExam as selectExam
} from './reducers/exams.feature';
import {
  certificatesFeature,
  selectSelectedCertificate
} from './reducers/certificates.feature';

/**
 * All effects for the schoolar feature
 */
export const scholarEffects = [
  StudentsEffects,
  LessonsEffects,
  CertificatesEffects,
];

/**
 * @deprecated Use provideState() with feature objects instead
 */
export const scholarReducers = {
  [studentsFeature.name]: studentsFeature.reducer,
  [classesFeature.name]: classesFeature.reducer,
  [examsFeature.name]: examsFeature.reducer,
  [certificatesFeature.name]: certificatesFeature.reducer,
};

// Re-export all the actions, reducers, and state
export * from './actions/students.actions';
export * from './actions/lessons.actions';
export * from './actions/exams.actions';
export * from './actions/certificates.actions';
export * from './reducers/students.reducers';
export * from './reducers/classes.reducers';
export * from './reducers/exams.feature';
export * from './reducers/certificates.feature';
export * from './schoolar.state';


// Export entity selectors
export {
  selectAllStudents,
  selectStudentEntities,
  selectSelectedStudent,
  selectSelectedCertificate,
};
