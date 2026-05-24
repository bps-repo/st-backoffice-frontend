import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SellerEvolution, SellerEvolutionFilter } from 'src/app/core/models/finance/seller-evolution.model';

export const SELLER_EVOLUTION_FEATURE_KEY = 'sellerEvolution';

export const SellerEvolutionActions = createActionGroup({
    source: SELLER_EVOLUTION_FEATURE_KEY,
    events: {
        Load:           props<{ filter: SellerEvolutionFilter }>(),
        'Load Success': props<{ sellers: SellerEvolution[] }>(),
        'Load Failure': props<{ error: unknown }>(),
        'Clear Error':  emptyProps(),
    },
});
