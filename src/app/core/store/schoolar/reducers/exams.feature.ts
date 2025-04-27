import { createFeature } from '@ngrx/store';
import { examsReducer } from './exams.reducer';

export const examsFeature = createFeature({
    name: 'exams',
    reducer: examsReducer
});

export const {
    selectExamsState,
    selectSelectedExam,
    selectLoading: selectExamLoading,
    selectErrors
} = examsFeature;
