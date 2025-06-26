import { createFeature, createReducer, on } from '@ngrx/store';
import { ASSESSMENT_FEATURE_KEY, AssessmentActions } from './assessment.actions';
import { assessmentInitialState, assessmentsAdapter } from './assessmentState';

export const assessmentFeature = createFeature({
  name: ASSESSMENT_FEATURE_KEY,
  reducer: createReducer(
    assessmentInitialState,

    // Load unit assessments
    on(AssessmentActions.loadUnitAssessments, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AssessmentActions.loadUnitAssessmentsSuccess, (state, { unitId, assessments }) => {
      // Add assessments to the entity store
      const newState = assessmentsAdapter.upsertMany(assessments, {
        ...state,
        loading: false,
        error: null,
        lastFetch: Date.now(),
        cacheExpired: false,
      });

      // Also store them by unit ID for easy lookup
      return {
        ...newState,
        assessmentsByUnit: {
          ...newState.assessmentsByUnit,
          [unitId]: assessments,
        },
      };
    }),
    on(AssessmentActions.loadUnitAssessmentsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Cache management
    on(AssessmentActions.setLastFetch, (state, { timestamp }) => ({
      ...state,
      lastFetch: timestamp,
    })),
    on(AssessmentActions.setCacheExpired, (state, { expired }) => ({
      ...state,
      cacheExpired: expired,
    })),
    on(AssessmentActions.refreshCache, (state) => ({
      ...state,
      cacheExpired: true,
    })),
    on(AssessmentActions.clearCache, (state) =>
      assessmentsAdapter.removeAll({
        ...state,
        assessmentsByUnit: {},
        lastFetch: null,
        cacheExpired: false,
      })
    ),

    // Clear errors
    on(AssessmentActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

export const { name, reducer, selectAssessmentsState } = assessmentFeature;
