import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { UserActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserManagementService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(({ id }) =>
        this.userService.getUser(id).pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => of(UserActions.loadUserFailure({ error })))
        )
      )
    )
  );

  loadUserByEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserByEmail),
      mergeMap(({ email }) =>
        this.userService.getUserByEmail(email).pipe(
          map((user) => UserActions.loadUserByEmailSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByEmailFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map((updatedUser) => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  loadUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserRoles),
      mergeMap(({ userId }) =>
        this.userService.getUserRoles(userId).pipe(
          map((roles) => UserActions.loadUserRolesSuccess({ roles })),
          catchError((error) => of(UserActions.loadUserRolesFailure({ error })))
        )
      )
    )
  );

  addRoleToUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addRoleToUser),
      mergeMap(({ userId, roleId }) =>
        this.userService.addRoleToUser(userId, roleId).pipe(
          map((user) => UserActions.addRoleToUserSuccess({ user })),
          catchError((error) => of(UserActions.addRoleToUserFailure({ error })))
        )
      )
    )
  );

  removeRoleFromUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removeRoleFromUser),
      mergeMap(({ userId, roleId }) =>
        this.userService.removeRoleFromUser(userId, roleId).pipe(
          map((user) => UserActions.removeRoleFromUserSuccess({ user })),
          catchError((error) => of(UserActions.removeRoleFromUserFailure({ error })))
        )
      )
    )
  );

  loadUserPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserPermissions),
      mergeMap(({ userId }) =>
        this.userService.getUserPermissions(userId).pipe(
          map((permissions) => UserActions.loadUserPermissionsSuccess({ permissions })),
          catchError((error) => of(UserActions.loadUserPermissionsFailure({ error })))
        )
      )
    )
  );

  addPermissionToUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addPermissionToUser),
      mergeMap(({ userId, permissionId }) =>
        this.userService.addPermissionToUser(userId, permissionId).pipe(
          map((user) => UserActions.addPermissionToUserSuccess({ user })),
          catchError((error) => of(UserActions.addPermissionToUserFailure({ error })))
        )
      )
    )
  );

  removePermissionFromUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removePermissionFromUser),
      mergeMap(({ userId, permissionId }) =>
        this.userService.removePermissionFromUser(userId, permissionId).pipe(
          map((user) => UserActions.removePermissionFromUserSuccess({ user })),
          catchError((error) => of(UserActions.removePermissionFromUserFailure({ error })))
        )
      )
    )
  );
}
