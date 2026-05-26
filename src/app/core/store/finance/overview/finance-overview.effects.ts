import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { FinanceOverviewActions } from './finance-overview.actions';

@Injectable()
export class FinanceOverviewEffects {
    private actions$ = inject(Actions);
    private service = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FinanceOverviewActions.loadOverview),
            switchMap(({ filter }) =>
                this.service.getOverview(filter).pipe(
                    map((overview) => FinanceOverviewActions.loadOverviewSuccess({ overview })),
                    catchError((error) => of(FinanceOverviewActions.loadOverviewFailure({ error }))),
                ),
            ),
        ),
    );
}
