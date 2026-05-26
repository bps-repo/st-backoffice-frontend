import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FinanceDashboardService } from 'src/app/core/services/finance-dashboard.service';
import { SellerEvolutionActions } from './seller-evolution.actions';

@Injectable()
export class SellerEvolutionEffects {
    private actions$ = inject(Actions);
    private service  = inject(FinanceDashboardService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SellerEvolutionActions.load),
            switchMap(({ filter }) =>
                this.service.getSellerEvolution(filter).pipe(
                    map((sellers) => SellerEvolutionActions.loadSuccess({ sellers })),
                    catchError((error) => of(SellerEvolutionActions.loadFailure({ error }))),
                ),
            ),
        ),
    );
}
