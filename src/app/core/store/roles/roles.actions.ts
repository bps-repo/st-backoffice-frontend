import { createAction, props } from '@ngrx/store';
import { Role } from 'src/app/core/models/auth/role';

// Load Roles
export const loadRoles = createAction('[Roles] Load Roles');

export const loadRolesSuccess = createAction(
    '[Roles] Load Roles Success',
    props<{ roles: Role[] }>()
);
export const loadRolesFailure = createAction(
    '[Roles] Load Roles Failure',
    props<{ error: string }>()
);

// Load Role by ID
export const loadRole = createAction(
    '[Roles] Load Role',
    props<{ id: string }>()
);
export const loadRoleSuccess = createAction(
    '[Roles] Load Role Success',
    props<{ role: Role }>()
);
export const loadRoleFailure = createAction(
    '[Roles] Load Role Failure',
    props<{ error: string }>()
);

// Create Role
export const createRole = createAction(
    '[Roles] Create Role',
    props<{ role: Partial<Role> }>()
);
export const createRoleSuccess = createAction(
    '[Roles] Create Role Success',
    props<{ role: Role }>()
);
export const createRoleFailure = createAction(
    '[Roles] Create Role Failure',
    props<{ error: string }>()
);

// Create Role with Permissions
export const createRoleWithPermissions = createAction(
    '[Roles] Create Role With Permissions',
    props<{ name: string; description: string; permissionIds: string[] }>()
);
export const createRoleWithPermissionsSuccess = createAction(
    '[Roles] Create Role With Permissions Success',
    props<{ role: Role }>()
);
export const createRoleWithPermissionsFailure = createAction(
    '[Roles] Create Role With Permissions Failure',
    props<{ error: string }>()
);

// Update Role
export const updateRole = createAction(
    '[Roles] Update Role',
    props<{ role: Role }>()
);
export const updateRoleSuccess = createAction(
    '[Roles] Update Role Success',
    props<{ role: Role }>()
);
export const updateRoleFailure = createAction(
    '[Roles] Update Role Failure',
    props<{ error: string }>()
);

// Delete Role
export const deleteRole = createAction(
    '[Roles] Delete Role',
    props<{ id: string }>()
);
export const deleteRoleSuccess = createAction(
    '[Roles] Delete Role Success',
    props<{ id: string }>()
);
export const deleteRoleFailure = createAction(
    '[Roles] Delete Role Failure',
    props<{ error: string }>()
);

// Add Permission to Role
export const addPermissionToRole = createAction(
    '[Roles] Add Permission To Role',
    props<{ roleId: string; permissionId: string }>()
);
export const addPermissionToRoleSuccess = createAction(
    '[Roles] Add Permission To Role Success',
    props<{ role: Role }>()
);
export const addPermissionToRoleFailure = createAction(
    '[Roles] Add Permission To Role Failure',
    props<{ error: string }>()
);

// Remove Permission from Role
export const removePermissionFromRole = createAction(
    '[Roles] Remove Permission From Role',
    props<{ roleId: string; permissionId: string }>()
);
export const removePermissionFromRoleSuccess = createAction(
    '[Roles] Remove Permission From Role Success',
    props<{ role: Role }>()
);
export const removePermissionFromRoleFailure = createAction(
    '[Roles] Remove Permission From Role Failure',
    props<{ error: string }>()
);

// Add Permissions Bulk to Role
export const addPermissionsBulkToRole = createAction(
    '[Roles] Add Permissions Bulk To Role',
    props<{ roleId: string; permissionIds: string[] }>()
);
export const addPermissionsBulkToRoleSuccess = createAction(
    '[Roles] Add Permissions Bulk To Role Success',
    props<{ role: Role }>()
);
export const addPermissionsBulkToRoleFailure = createAction(
    '[Roles] Add Permissions Bulk To Role Failure',
    props<{ error: string }>()
);

// Set Selected Role
export const setSelectedRole = createAction(
    '[Roles] Set Selected Role',
    props<{ id: string | null }>()
);

// Clear Roles Error
export const clearRolesError = createAction('[Roles] Clear Roles Error');
