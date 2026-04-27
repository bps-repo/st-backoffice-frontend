import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PageableResponse } from 'src/app/core/models/ApiResponseService';
import { InvoiceDetail, InvoiceListItem } from 'src/app/core/models/invoice/invoice.model';

export const SALES_FEATURE_KEY = 'sales';

export const SalesActions = createActionGroup({
    source: SALES_FEATURE_KEY,
    events: {
        'Load Sales': emptyProps(),
        'Load Sales Success': props<PageableResponse<InvoiceListItem>>(),
        'Load Sales Failure': props<{ error: any }>(),

        'Load Sale Details': props<{ id: string }>(),
        'Load Sale Details Success': props<{ sale: InvoiceDetail }>(),
        'Load Sale Details Failure': props<{ error: any }>(),

        'Clear Sales Error': emptyProps(),
        'Clear Sale Details Error': emptyProps(),
    },
});
