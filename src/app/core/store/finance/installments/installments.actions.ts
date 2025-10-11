import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Installment} from 'src/app/core/models/payment/installment';

export const INSTALLMENTS_FEATURE_KEY = 'installments';

export interface LoadParams {
    page: number;
    size: number;
    sort?: string;
}

export const InstallmentsActions = createActionGroup({
    source: INSTALLMENTS_FEATURE_KEY,
    events: {
        'Load Installments': props<LoadParams>(),
        'Load Installments Success': props<{
            content: Installment[];
            totalElements: number;
            page: number;
            size: number;
            totalPages: number;
        }>(),
        'Load Installments Failure': props<{ error: any }>(),

        'Pay Installment': props<{ installmentId: string; payload: any }>(),
        'Pay Installment Success': props<{ installment: Installment }>(),
        'Pay Installment Failure': props<{ error: any }>(),

        'Clear Error': emptyProps(),
    },
});
