import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { InvoiceTrendsActions } from './invoice-trends.actions';

@Injectable()
export class InvoiceTrendsEffects {
    private actions$ = inject(Actions);
    private service = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InvoiceTrendsActions.loadTrends),
            switchMap(({ filter }) =>
                this.service.getInvoiceTrends(filter).pipe(
                    map((trends) => InvoiceTrendsActions.loadTrendsSuccess({ trends })),
                    catchError((error) => of(InvoiceTrendsActions.loadTrendsFailure({ error }))),
                ),
            ),
        ),
    );
}
