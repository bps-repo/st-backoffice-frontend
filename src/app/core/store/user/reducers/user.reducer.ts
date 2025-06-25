import { createFeature, createReducer, on } from '@ngrx/store';
import { USER_FEATURE_KEY, UserActions } from '../actions/user.actions';
import { userInitialState, usersAdapter } from '../state/userState';

export const UserFeature = createFeature({
  name: USER_FEATURE_KEY,
  reducer: createReducer(
    userInitialState,

    // Load users
    on(UserActions.loadUsers, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UserActions.loadUsersSuccess, (state, { users }) =>
      usersAdapter.setAll(users, {
        ...state,
        loading: false,
        error: null
      })
    ),
    on(UserActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Load user
    on(UserActions.loadUser, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UserActions.loadUserSuccess, (state, { user }) =>
      usersAdapter.upsertOne(user, {
        ...state,
        selectedUser: user,
        loading: false,
        error: null
      })
    ),
    on(UserActions.loadUserFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Load user by email
    on(UserActions.loadUserByEmail, (state) => ({
      ...state,
      loading: true,
      error: null
    })),
    on(UserActions.loadUserByEmailSuccess, (state, { user }) =>
      usersAdapter.upsertOne(user, {
        ...state,
        selectedUser: user,
        loading: false,
        error: null
      })
    ),
    on(UserActions.loadUserByEmailFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    // Update user
    on(UserActions.updateUser, (state) => ({
      ...state,
      loadingUpdate: true,
      errorUpdate: null
    })),
    on(UserActions.updateUserSuccess, (state, { user }) =>
      usersAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          selectedUser: user,
          loadingUpdate: false,
          errorUpdate: null
        }
      )
    ),
    on(UserActions.updateUserFailure, (state, { error }) => ({
      ...state,
      loadingUpdate: false,
      errorUpdate: error
    })),

    // Load user roles
    on(UserActions.loadUserRoles, (state) => ({
      ...state,
      loadingRoles: true,
      errorRoles: null
    })),
    on(UserActions.loadUserRolesSuccess, (state, { roles }) => ({
      ...state,
      selectedUserRoles: roles,
      loadingRoles: false,
      errorRoles: null
    })),
    on(UserActions.loadUserRolesFailure, (state, { error }) => ({
      ...state,
      loadingRoles: false,
      errorRoles: error
    })),

    // Add role to user
    on(UserActions.addRoleToUser, (state) => ({
      ...state,
      loadingRoles: true,
      errorRoles: null
    })),
    on(UserActions.addRoleToUserSuccess, (state, { user }) =>
      usersAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          selectedUser: user,
          loadingRoles: false,
          errorRoles: null
        }
      )
    ),
    on(UserActions.addRoleToUserFailure, (state, { error }) => ({
      ...state,
      loadingRoles: false,
      errorRoles: error
    })),

    // Remove role from user
    on(UserActions.removeRoleFromUser, (state) => ({
      ...state,
      loadingRoles: true,
      errorRoles: null
    })),
    on(UserActions.removeRoleFromUserSuccess, (state, { user }) =>
      usersAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          selectedUser: user,
          loadingRoles: false,
          errorRoles: null
        }
      )
    ),
    on(UserActions.removeRoleFromUserFailure, (state, { error }) => ({
      ...state,
      loadingRoles: false,
      errorRoles: error
    })),

    // Load user permissions
    on(UserActions.loadUserPermissions, (state) => ({
      ...state,
      loadingPermissions: true,
      errorPermissions: null
    })),
    on(UserActions.loadUserPermissionsSuccess, (state, { permissions }) => ({
      ...state,
      selectedUserPermissions: permissions,
      loadingPermissions: false,
      errorPermissions: null
    })),
    on(UserActions.loadUserPermissionsFailure, (state, { error }) => ({
      ...state,
      loadingPermissions: false,
      errorPermissions: error
    })),

    // Add permission to user
    on(UserActions.addPermissionToUser, (state) => ({
      ...state,
      loadingPermissions: true,
      errorPermissions: null
    })),
    on(UserActions.addPermissionToUserSuccess, (state, { user }) =>
      usersAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          selectedUser: user,
          loadingPermissions: false,
          errorPermissions: null
        }
      )
    ),
    on(UserActions.addPermissionToUserFailure, (state, { error }) => ({
      ...state,
      loadingPermissions: false,
      errorPermissions: error
    })),

    // Remove permission from user
    on(UserActions.removePermissionFromUser, (state) => ({
      ...state,
      loadingPermissions: true,
      errorPermissions: null
    })),
    on(UserActions.removePermissionFromUserSuccess, (state, { user }) =>
      usersAdapter.updateOne(
        { id: user.id, changes: user },
        {
          ...state,
          selectedUser: user,
          loadingPermissions: false,
          errorPermissions: null
        }
      )
    ),
    on(UserActions.removePermissionFromUserFailure, (state, { error }) => ({
      ...state,
      loadingPermissions: false,
      errorPermissions: error
    })),

    // Clear state
    on(UserActions.clearUsers, (state) =>
      usersAdapter.removeAll({
        ...state,
        selectedUser: null,
        selectedUserRoles: null,
        selectedUserPermissions: null
      })
    ),
    on(UserActions.clearUsersErrors, (state) => ({
      ...state,
      error: null,
      errorUpdate: null,
      errorRoles: null,
      errorPermissions: null
    }))
  )
});
