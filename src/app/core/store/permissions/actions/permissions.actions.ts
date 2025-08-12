import { createAction, props } from '@ngrx/store';
import { Permission } from 'src/app/core/models/auth/permission';

// Load Permissions
export const loadPermissions = createAction('[Permissions] Load Permissions');
export const loadPermissionsSuccess = createAction(
  '[Permissions] Load Permissions Success',
  props<{ permissions: Permission[] }>()
);
export const loadPermissionsFailure = createAction(
  '[Permissions] Load Permissions Failure',
  props<{ error: string }>()
);

// Load Permission Tree
export const loadPermissionTree = createAction('[Permissions] Load Permission Tree');
export const loadPermissionTreeSuccess = createAction(
  '[Permissions] Load Permission Tree Success',
  props<{ permissionTree: Permission[] }>()
);
export const loadPermissionTreeFailure = createAction(
  '[Permissions] Load Permission Tree Failure',
  props<{ error: string }>()
);

// Load Permission by ID
export const loadPermission = createAction(
  '[Permissions] Load Permission',
  props<{ id: string }>()
);
export const loadPermissionSuccess = createAction(
  '[Permissions] Load Permission Success',
  props<{ permission: Permission }>()
);
export const loadPermissionFailure = createAction(
  '[Permissions] Load Permission Failure',
  props<{ error: string }>()
);

// Create Permission
export const createPermission = createAction(
  '[Permissions] Create Permission',
  props<{ permission: Partial<Permission> }>()
);
export const createPermissionSuccess = createAction(
  '[Permissions] Create Permission Success',
  props<{ permission: Permission }>()
);
export const createPermissionFailure = createAction(
  '[Permissions] Create Permission Failure',
  props<{ error: string }>()
);

// Update Permission
export const updatePermission = createAction(
  '[Permissions] Update Permission',
  props<{ permission: Permission }>()
);
export const updatePermissionSuccess = createAction(
  '[Permissions] Update Permission Success',
  props<{ permission: Permission }>()
);
export const updatePermissionFailure = createAction(
  '[Permissions] Update Permission Failure',
  props<{ error: string }>()
);

// Delete Permission
export const deletePermission = createAction(
  '[Permissions] Delete Permission',
  props<{ id: string }>()
);
export const deletePermissionSuccess = createAction(
  '[Permissions] Delete Permission Success',
  props<{ id: string }>()
);
export const deletePermissionFailure = createAction(
  '[Permissions] Delete Permission Failure',
  props<{ error: string }>()
);

// Load Permissions by Role
export const loadPermissionsByRole = createAction(
  '[Permissions] Load Permissions By Role',
  props<{ roleId: string }>()
);
export const loadPermissionsByRoleSuccess = createAction(
  '[Permissions] Load Permissions By Role Success',
  props<{ permissions: Permission[] }>()
);
export const loadPermissionsByRoleFailure = createAction(
  '[Permissions] Load Permissions By Role Failure',
  props<{ error: string }>()
);

// Set Selected Permission
export const setSelectedPermission = createAction(
  '[Permissions] Set Selected Permission',
  props<{ id: string | null }>()
);

// Clear Permissions Error
export const clearPermissionsError = createAction('[Permissions] Clear Permissions Error');
