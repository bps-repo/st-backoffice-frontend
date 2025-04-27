import { createReducer, on } from '@ngrx/store';
import { Exam } from 'src/app/core/models/academic/exam';
import { loadExam, loadExamSuccess, loadExamFailure } from '../actions/exams.actions';

export interface ExamsState {
    selectedExam: Exam | null;
    loading: boolean;
    errors: any;
}

export const initialState: ExamsState = {
    selectedExam: null,
    loading: false,
    errors: null
};

export const examsReducer = createReducer(
    initialState,
    on(loadExam, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadExamSuccess, (state, { exam }) => ({
        ...state,
        selectedExam: exam,
        loading: false
    })),
    on(loadExamFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);
