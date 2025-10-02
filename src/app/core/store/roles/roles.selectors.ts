import {createFeatureSelector, createSelector} from '@ngrx/store';
import {rolesAdapter, RolesState} from './roles.state';

export const selectRolesState = createFeatureSelector<RolesState>('roles');

// Get the selectors
const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = rolesAdapter.getSelectors();

// Select all roles
export const selectAllRoles = createSelector(
    selectRolesState,
    selectAll
);

// Select role entities
export const selectRoleEntities = createSelector(
    selectRolesState,
    selectEntities
);

// Select the total number of roles
export const selectRolesTotal = createSelector(
    selectRolesState,
    selectTotal
);

// Select the selected role ID
export const selectSelectedRoleId = createSelector(
    selectRolesState,
    (state: RolesState) => state.selectedRoleId
);

// Select the selected role
export const selectSelectedRole = createSelector(
    selectRoleEntities,
    selectSelectedRoleId,
    (roleEntities, selectedRoleId) => selectedRoleId ? roleEntities[selectedRoleId] : null
);

// Select roles loading state
export const selectRolesLoading = createSelector(
    selectRolesState,
    (state: RolesState) => state.loading
);

// Select roles error state
export const selectRolesError = createSelector(
    selectRolesState,
    (state: RolesState) => state.error
);

// Select a role by ID
export const selectRoleById = (id: string) => createSelector(
    selectRoleEntities,
    (roleEntities) => roleEntities[id]
);
