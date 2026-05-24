import { createFeature, createReducer, on } from '@ngrx/store';
import { SellerEvolutionActions, SELLER_EVOLUTION_FEATURE_KEY } from './seller-evolution.actions';
import { initialSellerEvolutionState } from './seller-evolution.state';

export const sellerEvolutionFeature = createFeature({
    name: SELLER_EVOLUTION_FEATURE_KEY,
    reducer: createReducer(
        initialSellerEvolutionState,

        on(SellerEvolutionActions.load, (state, { filter }) => ({
            ...state,
            loading: true,
            error:   null,
            filter,
        })),

        on(SellerEvolutionActions.loadSuccess, (state, { sellers }) => ({
            ...state,
            loading: false,
            error:   null,
            sellers,
        })),

        on(SellerEvolutionActions.loadFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        on(SellerEvolutionActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
