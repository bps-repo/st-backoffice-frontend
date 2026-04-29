import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InvoiceTrends, InvoiceTrendsFilter } from 'src/app/core/models/finance/invoice-trends.model';

export const INVOICE_TRENDS_FEATURE_KEY = 'invoiceTrends';

export const InvoiceTrendsActions = createActionGroup({
    source: INVOICE_TRENDS_FEATURE_KEY,
    events: {
        'Load Trends': props<{ filter: InvoiceTrendsFilter }>(),
        'Load Trends Success': props<{ trends: InvoiceTrends }>(),
        'Load Trends Failure': props<{ error: any }>(),
        'Set Filter': props<{ filter: InvoiceTrendsFilter }>(),
        'Clear Error': emptyProps(),
    },
});
