import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Installment} from 'src/app/core/models/payment/installment';

export interface InstallmentsState extends EntityState<Installment> {
    loading: boolean;
    error: any;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const installmentsAdapter: EntityAdapter<Installment> = createEntityAdapter<Installment>({
    selectId: (i) => i.id,
    sortComparer: false,
});

export const initialInstallmentsState: InstallmentsState = installmentsAdapter.getInitialState({
    loading: false,
    error: null,
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
});
