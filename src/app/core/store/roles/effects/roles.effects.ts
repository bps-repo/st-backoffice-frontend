import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RoleService } from 'src/app/core/services/role.service';
import * as RolesActions from '../actions/roles.actions';

@Injectable()
export class RolesEffects {
  constructor(
    private actions$: Actions,
    private roleService: RoleService
  ) {}

  loadRoles$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.loadRoles),
    switchMap(() => this.roleService.fetchRoles().pipe(
      map(roles => RolesActions.loadRolesSuccess({ roles })),
      catchError(error => of(RolesActions.loadRolesFailure({ error: error.message })))
    ))
  ));

  loadRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.loadRole),
    mergeMap(({ id }) => this.roleService.fetchRole(id).pipe(
      map(role => RolesActions.loadRoleSuccess({ role })),
      catchError(error => of(RolesActions.loadRoleFailure({ error: error.message })))
    ))
  ));

  createRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.createRole),
    mergeMap(({ role }) => this.roleService.postRole(role as any).pipe(
      map(createdRole => RolesActions.createRoleSuccess({ role: createdRole })),
      catchError(error => of(RolesActions.createRoleFailure({ error: error.message })))
    ))
  ));

  createRoleWithPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.createRoleWithPermissions),
    mergeMap(({ name, description, permissionIds }) =>
      this.roleService.postRoleWithPermissions(name, description, permissionIds).pipe(
        map(createdRole => RolesActions.createRoleWithPermissionsSuccess({ role: createdRole })),
        catchError(error => of(RolesActions.createRoleWithPermissionsFailure({ error: error.message })))
      )
    )
  ));

  updateRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.updateRole),
    mergeMap(({ role }) => this.roleService.putRole(role).pipe(
      map(updatedRole => RolesActions.updateRoleSuccess({ role: updatedRole })),
      catchError(error => of(RolesActions.updateRoleFailure({ error: error.message })))
    ))
  ));

  deleteRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.deleteRole),
    mergeMap(({ id }) => this.roleService.http.delete<void>(`${this.roleService.apiUrl}/${id}`).pipe(
      map(() => RolesActions.deleteRoleSuccess({ id })),
      catchError(error => of(RolesActions.deleteRoleFailure({ error: error.message })))
    ))
  ));

  addPermissionToRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.addPermissionToRole),
    mergeMap(({ roleId, permissionId }) =>
      this.roleService.postPermissionToRole(roleId, permissionId).pipe(
        map(role => RolesActions.addPermissionToRoleSuccess({ role })),
        catchError(error => of(RolesActions.addPermissionToRoleFailure({ error: error.message })))
      )
    )
  ));

  removePermissionFromRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.removePermissionFromRole),
    mergeMap(({ roleId, permissionId }) =>
      this.roleService.deletePermissionFromRole(roleId, permissionId).pipe(
        map(role => RolesActions.removePermissionFromRoleSuccess({ role })),
        catchError(error => of(RolesActions.removePermissionFromRoleFailure({ error: error.message })))
      )
    )
  ));

  addPermissionsBulkToRole$ = createEffect(() => this.actions$.pipe(
    ofType(RolesActions.addPermissionsBulkToRole),
    mergeMap(({ roleId, permissionIds }) =>
      this.roleService.postPermissionsBulkToRole(roleId, permissionIds).pipe(
        map(role => RolesActions.addPermissionsBulkToRoleSuccess({ role })),
        catchError(error => of(RolesActions.addPermissionsBulkToRoleFailure({ error: error.message })))
      )
    )
  ));
}
