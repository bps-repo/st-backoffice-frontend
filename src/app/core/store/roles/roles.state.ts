import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Role } from 'src/app/core/models/auth/role';

export const rolesAdapter = createEntityAdapter<Role>({
    selectId: (role: Role) => role.id,
    sortComparer: (a: Role, b: Role) => a.name.localeCompare(b.name),
});

export interface RolesState extends EntityState<Role> {
    selectedRoleId: string | null;
    loading: boolean;
    successFlag: boolean,
    error: string | null;
}

export const initialRolesState: RolesState = rolesAdapter.getInitialState({
    selectedRoleId: null,
    loading: false,
    successFlag: false,
    error: null,
});
