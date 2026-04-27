import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { SalesActions } from './sales.actions';

@Injectable()
export class SalesEffects {
    private actions$ = inject(Actions);
    private service = inject(InvoiceService);

    loadSales$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.loadSales),
            switchMap(() =>
                this.service.getInvoices().pipe(
                    map((res) => SalesActions.loadSalesSuccess(res.data)),
                    catchError((error) => of(SalesActions.loadSalesFailure({ error }))),
                ),
            ),
        ),
    );

    loadSaleDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SalesActions.loadSaleDetails),
            switchMap(({ id }) =>
                this.service.getInvoice(id).pipe(
                    map((res) => SalesActions.loadSaleDetailsSuccess({ sale: res.data })),
                    catchError((error) => of(SalesActions.loadSaleDetailsFailure({ error }))),
                ),
            ),
        ),
    );
}
