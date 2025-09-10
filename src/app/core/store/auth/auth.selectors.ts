import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducers';

export const selectAuthState = createSelector(
    authFeature.selectAuthState,
    (state) => state
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    (state) => state.loading
);
export const selectAuthLoadUserProfile = createSelector(
    selectAuthState,
    (state) => state.loadUserProfile
);
export const selectAuthLoadUserProfileSuccess = createSelector(
    selectAuthState,
    (state) => state.loadUserProfileSuccess
);
export const selectAuthLoadUserProfileFailure = createSelector(
    selectAuthState,
    (state) => state.loadUserProfileFailure
);
export const selectAuthUser = createSelector(
    selectAuthState,
    (state) => state.user
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state) => state.error
);

export const selectAuthRefreshToken = createSelector(
    selectAuthState,
    (state) => state.refreshToken
);

export const selectAuthToken = createSelector(
    selectAuthState,
    (state) => state.token
);
