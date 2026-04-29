import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { FinancePaymentDashboardActions } from './payment-dashboard.actions';

@Injectable()
export class FinancePaymentDashboardEffects {
    private actions$ = inject(Actions);
    private service = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FinancePaymentDashboardActions.load),
            switchMap(({ filter }) =>
                forkJoin({
                    summary: this.service.getPaymentSummary(filter),
                    trends: this.service.getPaymentTrends(filter),
                }).pipe(
                    map(({ summary, trends }) =>
                        FinancePaymentDashboardActions.loadSuccess({ summary, trends }),
                    ),
                    catchError((error) => of(FinancePaymentDashboardActions.loadFailure({ error }))),
                ),
            ),
        ),
    );
}
