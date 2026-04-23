import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PaymentService } from 'src/app/core/services/payment.service';
import { PaymentsActions } from './payments.actions';

@Injectable()
export class PaymentsEffects {
    private actions$ = inject(Actions);
    private service = inject(PaymentService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PaymentsActions.loadPayments),
            switchMap(({ page, size, sort }) =>
                this.service.getPayments(page, size, sort).pipe(
                    map((res) => PaymentsActions.loadPaymentsSuccess(res.data)),
                    catchError((error) => of(PaymentsActions.loadPaymentsFailure({ error }))),
                ),
            ),
        ),
    );
}
