import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CenterRevenue, CenterRevenueFilter } from 'src/app/core/models/finance/center-revenue.model';

export const FINANCE_CENTER_REVENUE_FEATURE_KEY = 'financeCenterRevenue';

export const CenterRevenueActions = createActionGroup({
    source: FINANCE_CENTER_REVENUE_FEATURE_KEY,
    events: {
        Load:           props<{ filter: CenterRevenueFilter }>(),
        'Load Success': props<{ data: CenterRevenue[] }>(),
        'Load Failure': props<{ error: unknown }>(),
        'Clear Error':  emptyProps(),
    },
});
