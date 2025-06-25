import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { User } from '../../../models/auth/user';
import { Role } from '../../../models/auth/role';
import { Permission } from '../../../models/auth/permission';

export interface UserState extends EntityState<User> {
  loading: boolean;
  loadingUpdate: boolean;
  loadingRoles: boolean;
  loadingPermissions: boolean;

  error: any;
  errorUpdate: any;
  errorRoles: any;
  errorPermissions: any;

  selectedUser: User | null;
  selectedUserRoles: Role[] | null;
  selectedUserPermissions: Permission[] | null;
}

export const usersAdapter = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: (a: User, b: User) => a.email.localeCompare(b.email)
});

export const userInitialState: UserState = usersAdapter.getInitialState({
  loading: false,
  loadingUpdate: false,
  loadingRoles: false,
  loadingPermissions: false,

  error: null,
  errorUpdate: null,
  errorRoles: null,
  errorPermissions: null,

  selectedUser: null,
  selectedUserRoles: null,
  selectedUserPermissions: null
});
