import { createReducer, on } from '@ngrx/store';
import { permissionsAdapter, initialPermissionsState } from '../models/permissions.state';
import * as PermissionsActions from '../actions/permissions.actions';

export const permissionsReducer = createReducer(
  initialPermissionsState,

  // Load Permissions
  on(PermissionsActions.loadPermissions, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.loadPermissionsSuccess, (state, { permissions }) =>
    permissionsAdapter.setAll(permissions, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(PermissionsActions.loadPermissionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Permission Tree
  on(PermissionsActions.loadPermissionTree, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.loadPermissionTreeSuccess, (state, { permissionTree }) => ({
    ...state,
    permissionTree,
    loading: false,
    error: null
  })),
  on(PermissionsActions.loadPermissionTreeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Permission
  on(PermissionsActions.loadPermission, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.loadPermissionSuccess, (state, { permission }) =>
    permissionsAdapter.upsertOne(permission, {
      ...state,
      selectedPermissionId: permission.id,
      loading: false,
      error: null
    })
  ),
  on(PermissionsActions.loadPermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Permission
  on(PermissionsActions.createPermission, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.createPermissionSuccess, (state, { permission }) =>
    permissionsAdapter.addOne(permission, {
      ...state,
      selectedPermissionId: permission.id,
      loading: false,
      error: null
    })
  ),
  on(PermissionsActions.createPermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Permission
  on(PermissionsActions.updatePermission, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.updatePermissionSuccess, (state, { permission }) =>
    permissionsAdapter.updateOne(
      { id: permission.id, changes: permission },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),
  on(PermissionsActions.updatePermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Permission
  on(PermissionsActions.deletePermission, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.deletePermissionSuccess, (state, { id }) =>
    permissionsAdapter.removeOne(id, {
      ...state,
      selectedPermissionId: state.selectedPermissionId === id ? null : state.selectedPermissionId,
      loading: false,
      error: null
    })
  ),
  on(PermissionsActions.deletePermissionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Permissions by Role
  on(PermissionsActions.loadPermissionsByRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PermissionsActions.loadPermissionsByRoleSuccess, (state, { permissions }) =>
    permissionsAdapter.setAll(permissions, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(PermissionsActions.loadPermissionsByRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Set Selected Permission
  on(PermissionsActions.setSelectedPermission, (state, { id }) => ({
    ...state,
    selectedPermissionId: id
  })),

  // Clear Permissions Error
  on(PermissionsActions.clearPermissionsError, (state) => ({
    ...state,
    error: null
  }))
);
