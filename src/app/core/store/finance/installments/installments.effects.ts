import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {InstallmentsActions} from './installments.actions';
import {InstallmentService} from 'src/app/core/services/installment.service';
import {catchError, map, mergeMap, of} from 'rxjs';

@Injectable()
export class InstallmentsEffects {
    private actions$ = inject(Actions);
    private service = inject(InstallmentService);

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InstallmentsActions.loadInstallments),
            mergeMap(({page, size, sort}) =>
                this.service.getInstallments(page, size, sort).pipe(
                    map((res) => InstallmentsActions.loadInstallmentsSuccess({
                        content: res.content,
                        totalElements: res.totalElements,
                        page: res.page,
                        size: res.size,
                        totalPages: res.totalPages,
                    })),
                    catchError((error) => of(InstallmentsActions.loadInstallmentsFailure({error})))
                )
            )
        )
    );

    pay$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InstallmentsActions.payInstallment),
            mergeMap(({installmentId, payload}) =>
                this.service.makePayment(installmentId, payload).pipe(
                    map((res) => InstallmentsActions.payInstallmentSuccess({installment: res.data})),
                    catchError((error) => of(InstallmentsActions.payInstallmentFailure({error})))
                )
            )
        )
    );
}
