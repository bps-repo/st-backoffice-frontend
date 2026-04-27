import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { InvoiceDetail, InvoiceListItem } from 'src/app/core/models/invoice/invoice.model';

export interface SalesState extends EntityState<InvoiceListItem> {
    loading: boolean;
    error: any;
    detailLoading: boolean;
    detailError: any;
    selectedSale: InvoiceDetail | null;
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const salesAdapter: EntityAdapter<InvoiceListItem> = createEntityAdapter<InvoiceListItem>({
    selectId: (sale) => sale.id,
    sortComparer: false,
});

export const initialSalesState: SalesState = salesAdapter.getInitialState({
    loading: false,
    error: null,
    detailLoading: false,
    detailError: null,
    selectedSale: null,
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
});
