import { createAction, props } from '@ngrx/store';

export const loadExam = createAction(
    '[Exams] Load Exam',
    props<{ id: string }>()
);

export const loadExamSuccess = createAction(
    '[Exams] Load Exam Success',
    props<{ exam: any }>()
);

export const loadExamFailure = createAction(
    '[Exams] Load Exam Failure',
    props<{ error: any }>()
);

export const examsActions = {
    loadExam,
    loadExamSuccess,
    loadExamFailure
};
