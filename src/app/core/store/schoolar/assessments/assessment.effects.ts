import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { AssessmentActions } from './assessment.actions';

@Injectable()
export class AssessmentEffects {
  constructor(private actions$: Actions, private assessmentService: AssessmentService) {}

  loadUnitAssessments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssessmentActions.loadUnitAssessments),
      mergeMap(({ unitId }) =>
        this.assessmentService.getUnitAssessments(unitId).pipe(
          map((assessments) => AssessmentActions.loadUnitAssessmentsSuccess({ unitId, assessments })),
          catchError((error) => of(AssessmentActions.loadUnitAssessmentsFailure({ error: error.message })))
        )
      )
    )
  );
}
