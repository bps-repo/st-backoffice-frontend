import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducers';
import { AuthState } from './auth.state';

// Base selectors from the feature
export const selectAuthState = authFeature.selectAuthState;
export const selectUser = authFeature.selectUser;
export const selectIsAuthenticated = authFeature.selectIsAuthenticated;
export const selectToken = authFeature.selectToken;
export const selectRefreshToken = authFeature.selectRefreshToken;
export const selectLoading = authFeature.selectLoading;
export const selectError = authFeature.selectError;

// Additional selectors for auth state properties
export const selectAuthLoading = selectLoading; // Alias for consistency
export const selectAuthToken = selectToken; // Alias for consistency
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
export const selectAuthShouldNavigateAfterProfileLoad = createSelector(
  selectAuthState,
  (state) => state.shouldNavigateAfterProfileLoad
);

// Custom selectors for permissions
export const selectUserPermissions = createSelector(
  selectUser,
  (user) => user?.allPermissions || user?.permissions || []
);

export const selectUserPermissionNames = createSelector(
  selectUserPermissions,
  (permissions) => permissions.map(p => p.key)
);

export const selectUserHasPermission = (permissionName: string) => createSelector(
  selectUserPermissionNames,
  (permissionNames) => permissionNames.includes(permissionName)
);

export const selectUserHasAnyPermission = (permissionNames: string[]) => createSelector(
  selectUserPermissionNames,
  (userPermissionNames) => permissionNames.some(permissionName =>
    userPermissionNames.includes(permissionName)
  )
);

export const selectUserHasAllPermissions = (permissionNames: string[]) => createSelector(
  selectUserPermissionNames,
  (userPermissionNames) => permissionNames.every(permissionName =>
    userPermissionNames.includes(permissionName)
  )
);
