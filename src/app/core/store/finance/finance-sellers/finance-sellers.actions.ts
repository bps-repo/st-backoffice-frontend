import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FinanceSellerTopRanking, FinanceSellersFilter } from 'src/app/core/models/finance/finance-sellers.model';

export const FINANCE_SELLERS_FEATURE_KEY = 'financeSellers';

export const FinanceSellersActions = createActionGroup({
    source: FINANCE_SELLERS_FEATURE_KEY,
    events: {
        'Load Sellers': props<{ filter: FinanceSellersFilter }>(),
        'Load Sellers Success': props<{ sellers: FinanceSellerTopRanking[] }>(),
        'Load Sellers Failure': props<{ error: unknown }>(),
        'Clear Error': emptyProps(),
    },
});
