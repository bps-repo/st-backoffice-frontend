import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { FinanceSellersActions } from './finance-sellers.actions';

@Injectable()
export class FinanceSellersEffects {
    private actions$ = inject(Actions);
    private service = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FinanceSellersActions.loadSellers),
            switchMap(({ filter }) =>
                this.service.getFinanceSellersTop(filter).pipe(
                    map((sellers) => FinanceSellersActions.loadSellersSuccess({ sellers })),
                    catchError((error) => of(FinanceSellersActions.loadSellersFailure({ error }))),
                ),
            ),
        ),
    );
}
