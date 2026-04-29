import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FinanceOverview, FinanceOverviewFilter } from 'src/app/core/models/finance/finance-overview.model';

export const FINANCE_OVERVIEW_FEATURE_KEY = 'financeOverview';

export const FinanceOverviewActions = createActionGroup({
    source: FINANCE_OVERVIEW_FEATURE_KEY,
    events: {
        'Load Overview': props<{ filter: FinanceOverviewFilter }>(),
        'Load Overview Success': props<{ overview: FinanceOverview }>(),
        'Load Overview Failure': props<{ error: any }>(),
        'Set Filter': props<{ filter: FinanceOverviewFilter }>(),
        'Clear Error': emptyProps(),
    },
});
