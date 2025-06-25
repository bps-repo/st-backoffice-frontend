import { createSelector } from '@ngrx/store';
import { UserFeature } from '../reducers/user.reducer';
import { usersAdapter } from '../state/userState';

// Get the selectors
const {
  selectUserState,
  selectLoading,
  selectLoadingUpdate,
  selectLoadingRoles,
  selectLoadingPermissions,
  selectError,
  selectErrorUpdate,
  selectErrorRoles,
  selectErrorPermissions,
  selectSelectedUser,
  selectSelectedUserRoles,
  selectSelectedUserPermissions
} = UserFeature;

// Get the selectors from the adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = usersAdapter.getSelectors(selectUserState);

// Select all users
export const selectAllUsers = selectAll;

// Select user entities
export const selectUserEntities = selectEntities;

// Select user IDs
export const selectUserIds = selectIds;

// Select total number of users
export const selectTotalUsers = selectTotal;

// Select a user by ID
export const selectUserById = (id: string) => createSelector(
  selectUserEntities,
  (entities) => entities[id]
);

// Select a user by email
export const selectUserByEmail = (email: string) => createSelector(
  selectAllUsers,
  (users) => users.find(user => user.email === email)
);

// Select loading states
export const selectLoadingUsers = selectLoading;
export const selectLoadingUpdateUser = selectLoadingUpdate;
export const selectLoadingUserRoles = selectLoadingRoles;
export const selectLoadingUserPermissions = selectLoadingPermissions;

// Select error states
export const selectUsersError = selectError;
export const selectUpdateUserError = selectErrorUpdate;
export const selectUserRolesError = selectErrorRoles;
export const selectUserPermissionsError = selectErrorPermissions;

// Select any error
export const selectUserAnyError = createSelector(
  selectError,
  selectErrorUpdate,
  selectErrorRoles,
  selectErrorPermissions,
  (error, updateError, rolesError, permissionsError) =>
    error || updateError || rolesError || permissionsError
);

// Select the selected user
export const selectCurrentUser = selectSelectedUser;

// Select the selected user's roles
export const selectCurrentUserRoles = selectSelectedUserRoles;

// Select the selected user's permissions
export const selectCurrentUserPermissions = selectSelectedUserPermissions;
