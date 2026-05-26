import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { CenterRevenueActions } from './center-revenue.actions';

@Injectable()
export class CenterRevenueEffects {
    private actions$ = inject(Actions);
    private service  = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CenterRevenueActions.load),
            switchMap(({ filter }) =>
                this.service.getCenterRevenue(filter).pipe(
                    map((data) => CenterRevenueActions.loadSuccess({ data })),
                    catchError((error) => of(CenterRevenueActions.loadFailure({ error }))),
                ),
            ),
        ),
    );
}
