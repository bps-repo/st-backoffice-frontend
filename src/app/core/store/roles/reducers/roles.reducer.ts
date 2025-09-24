import {createReducer, on} from '@ngrx/store';
import {rolesAdapter, initialRolesState} from '../models/roles.state';
import * as RolesActions from '../actions/roles.actions';

export const rolesReducer = createReducer(
    initialRolesState,

    // Load Roles
    on(RolesActions.loadRoles, (state) => ({
        ...state,
        loading: state.ids.length > 0 ? false : true,
        error: null
    })),
    on(RolesActions.loadRolesSuccess, (state, {roles}) =>
        rolesAdapter.setAll(roles, {
            ...state,
            loading: false,
            error: null
        })
    ),
    on(RolesActions.loadRolesFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Role
    on(RolesActions.loadRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.loadRoleSuccess, (state, {role}) =>
        rolesAdapter.upsertOne(role, {
            ...state,
            selectedRoleId: role.id,
            loading: false,
            error: null
        })
    ),
    on(RolesActions.loadRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Role
    on(RolesActions.createRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.createRoleSuccess, (state, {role}) =>
        rolesAdapter.addOne(role, {
            ...state,
            selectedRoleId: role.id,
            loading: false,
            error: null
        })
    ),
    on(RolesActions.createRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Role with Permissions
    on(RolesActions.createRoleWithPermissions, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.createRoleWithPermissionsSuccess, (state, {role}) =>
        rolesAdapter.addOne(role, {
            ...state,
            selectedRoleId: role.id,
            loading: false,
            error: null
        })
    ),
    on(RolesActions.createRoleWithPermissionsFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Update Role
    on(RolesActions.updateRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.updateRoleSuccess, (state, {role}) =>
        rolesAdapter.updateOne(
            {id: role.id, changes: role},
            {
                ...state,
                loading: false,
                error: null
            }
        )
    ),
    on(RolesActions.updateRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Delete Role
    on(RolesActions.deleteRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.deleteRoleSuccess, (state, {id}) =>
        rolesAdapter.removeOne(id, {
            ...state,
            selectedRoleId: state.selectedRoleId === id ? null : state.selectedRoleId,
            loading: false,
            error: null
        })
    ),
    on(RolesActions.deleteRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Add Permission to Role
    on(RolesActions.addPermissionToRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.addPermissionToRoleSuccess, (state, {role}) =>
        rolesAdapter.updateOne(
            {id: role.id, changes: role},
            {
                ...state,
                loading: false,
                error: null
            }
        )
    ),
    on(RolesActions.addPermissionToRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Remove Permission from Role
    on(RolesActions.removePermissionFromRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.removePermissionFromRoleSuccess, (state, {role}) =>
        rolesAdapter.updateOne(
            {id: role.id, changes: role},
            {
                ...state,
                loading: false,
                error: null
            }
        )
    ),
    on(RolesActions.removePermissionFromRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Add Permissions Bulk to Role
    on(RolesActions.addPermissionsBulkToRole, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(RolesActions.addPermissionsBulkToRoleSuccess, (state, {role}) =>
        rolesAdapter.updateOne(
            {id: role.id, changes: role},
            {
                ...state,
                loading: false,
                error: null
            }
        )
    ),
    on(RolesActions.addPermissionsBulkToRoleFailure, (state, {error}) => ({
        ...state,
        loading: false,
        error
    })),

    // Set Selected Role
    on(RolesActions.setSelectedRole, (state, {id}) => ({
        ...state,
        selectedRoleId: id
    })),

    // Clear Roles Error
    on(RolesActions.clearRolesError, (state) => ({
        ...state,
        error: null
    }))
);
