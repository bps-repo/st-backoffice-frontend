import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Exam } from 'src/app/core/models/academic/exam';
import { EXAMS } from 'src/app/shared/constants/exams';

// Mock implementation for demonstration purposes
// In a real app, this would select from the store state
export const selectExamsState = createFeatureSelector<{ selectedExam: Exam | null }>('exams');

export const selectSelectedExam = createSelector(
    selectExamsState,
    state => {
        // For demonstration, we'll just return the first exam from the mock data
        // In a real app, this would return state.selectedExam
        return EXAMS[0];
    }
);
