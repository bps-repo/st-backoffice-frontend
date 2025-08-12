import { RolesState } from './roles/models/roles.state';
import { PermissionsState } from './permissions/models/permissions.state';

export interface AppState {
  roles: RolesState;
  permissions: PermissionsState;
}
