import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EntityPayment } from 'src/app/core/models/payment/installment';

export interface PaymentsState extends EntityState<EntityPayment> {
    loading: boolean;
    error: any;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const paymentsAdapter: EntityAdapter<EntityPayment> = createEntityAdapter<EntityPayment>({
    selectId: (p) => p.id,
    sortComparer: false,
});

export const initialPaymentsState: PaymentsState = paymentsAdapter.getInitialState({
    loading: false,
    error: null,
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
});
