import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../models/auth/user';
import { Role } from '../../../models/auth/role';
import { Permission } from '../../../models/auth/permission';

export const USER_FEATURE_KEY = 'User';

export const UserActions = createActionGroup({
  source: USER_FEATURE_KEY,
  events: {
    // Get all users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: any }>(),

    // Get user by ID
    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ error: any }>(),

    // Get user by email
    'Load User By Email': props<{ email: string }>(),
    'Load User By Email Success': props<{ user: User }>(),
    'Load User By Email Failure': props<{ error: any }>(),

    // Update user
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: any }>(),

    // User roles management
    'Load User Roles': props<{ userId: string }>(),
    'Load User Roles Success': props<{ roles: Role[] }>(),
    'Load User Roles Failure': props<{ error: any }>(),

    'Add Role To User': props<{ userId: string, roleId: number }>(),
    'Add Role To User Success': props<{ user: User }>(),
    'Add Role To User Failure': props<{ error: any }>(),

    'Remove Role From User': props<{ userId: string, roleId: number }>(),
    'Remove Role From User Success': props<{ user: User }>(),
    'Remove Role From User Failure': props<{ error: any }>(),

    // User permissions management
    'Load User Permissions': props<{ userId: string }>(),
    'Load User Permissions Success': props<{ permissions: Permission[] }>(),
    'Load User Permissions Failure': props<{ error: any }>(),

    'Add Permission To User': props<{ userId: string, permissionId: number }>(),
    'Add Permission To User Success': props<{ user: User }>(),
    'Add Permission To User Failure': props<{ error: any }>(),

    'Remove Permission From User': props<{ userId: string, permissionId: number }>(),
    'Remove Permission From User Success': props<{ user: User }>(),
    'Remove Permission From User Failure': props<{ error: any }>(),

    // Clear state
    'Clear Users': emptyProps(),
    'Clear Users Errors': emptyProps(),
  },
});
