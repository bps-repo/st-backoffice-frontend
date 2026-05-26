import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EntityPayment } from 'src/app/core/models/payment/installment';
import { PageableResponse } from '../../../models/ApiResponseService';

export const PAYMENTS_FEATURE_KEY = 'payments';

export interface LoadPaymentsParams {
    page: number;
    size: number;
    sort?: string;
}

export const PaymentsActions = createActionGroup({
    source: PAYMENTS_FEATURE_KEY,
    events: {
        'Load Payments': props<LoadPaymentsParams>(),
        'Load Payments Success': props<PageableResponse<EntityPayment>>(),
        'Load Payments Failure': props<{ error: any }>(),

        'Clear Error': emptyProps(),
    },
});
