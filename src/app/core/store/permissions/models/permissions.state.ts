import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Permission } from 'src/app/core/models/auth/permission';

export const permissionsAdapter = createEntityAdapter<Permission>({
  selectId: (permission: Permission) => permission.id,
  sortComparer: (a: Permission, b: Permission) => a.name.localeCompare(b.name),
});

export interface PermissionsState extends EntityState<Permission> {
  selectedPermissionId: string | null;
  permissionTree: Permission[];
  loading: boolean;
  error: string | null;
}

export const initialPermissionsState: PermissionsState = permissionsAdapter.getInitialState({
  selectedPermissionId: null,
  permissionTree: [],
  loading: false,
  error: null,
});
