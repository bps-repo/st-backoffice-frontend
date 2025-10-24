import { createFeatureSelector, createSelector } from '@ngrx/store';
import { permissionsAdapter, PermissionsState } from '../models/permissions.state';

export const selectPermissionsState = createFeatureSelector<PermissionsState>('permissions');

// Get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = permissionsAdapter.getSelectors();

// Select all permissions
export const selectAllPermissions = createSelector(
  selectPermissionsState,
  selectAll
);

// Select permission entities
export const selectPermissionEntities = createSelector(
  selectPermissionsState,
  selectEntities
);

// Select the total number of permissions
export const selectPermissionsTotal = createSelector(
  selectPermissionsState,
  selectTotal
);

// Select the permission tree
export const selectPermissionTree = createSelector(
  selectPermissionsState,
  (state: PermissionsState) => state.permissionTree
);

// Select the selected permission ID
export const selectSelectedPermissionId = createSelector(
  selectPermissionsState,
  (state: PermissionsState) => state.selectedPermissionId
);

// Select the selected permission
export const selectSelectedPermission = createSelector(
  selectPermissionEntities,
  selectSelectedPermissionId,
  (permissionEntities, selectedPermissionId) =>
    selectedPermissionId ? permissionEntities[selectedPermissionId] : null
);

// Select permissions loading state
export const selectPermissionsLoading = createSelector(
  selectPermissionsState,
  (state: PermissionsState) => state.loading
);

// Select permissions error state
export const selectPermissionsError = createSelector(
  selectPermissionsState,
  (state: PermissionsState) => state.error
);

// Select a permission by ID
export const selectPermissionById = (id: string) => createSelector(
  selectPermissionEntities,
  (permissionEntities) => permissionEntities[id]
);
