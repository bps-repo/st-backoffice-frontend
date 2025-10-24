import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RoleService } from 'src/app/core/services/role.service';
import * as RolesActions from './roles.actions';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';

@Injectable()
export class RolesEffects {
    constructor(
        private actions$: Actions,
        private roleService: RoleService
    ) { }

    loadRoles$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.loadRoles),
        switchMap(() => this.roleService.getAllRoles().pipe(
            map(roles => RolesActions.loadRolesSuccess({ roles })),
            catchError((error: HttpErrorResponse) => of(RolesActions.loadRolesFailure({ error: error.error.message })))
        ))
    ));

    loadRole$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.loadRole),
        mergeMap(({ id }) => this.roleService.getRoleById(id).pipe(
            map(role => RolesActions.loadRoleSuccess({ role })),
            catchError(error => of(RolesActions.loadRoleFailure({ error: error.message })))
        ))
    ));

    createRole$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.createRole),
        mergeMap(({ role }) => this.roleService.createRole(role as any).pipe(
            map(createdRole => RolesActions.createRoleSuccess({ role: createdRole })),
            catchError(error => of(RolesActions.createRoleFailure({ error: error.message })))
        ))
    ));

    createRoleWithPermissions$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.createRoleWithPermissions),
        mergeMap(({ name, description, permissionIds }) =>
            this.roleService.createRoleWithPermissions(name, description, permissionIds).pipe(
                map(createdRole => RolesActions.createRoleWithPermissionsSuccess({ role: createdRole })),
                catchError((error: HttpErrorResponse) => of(RolesActions.createRoleWithPermissionsFailure({ error: error.error.message })))
            )
        )
    ));

    updateRole$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.updateRole),
        mergeMap(({ role }) => this.roleService.updateRole(role).pipe(
            map(updatedRole => RolesActions.updateRoleSuccess({ role: updatedRole })),
            catchError((error: HttpErrorResponse) => of(RolesActions.updateRoleFailure({ error: error.error.message })))
        ))
    ));

    deleteRole$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.deleteRole),
        mergeMap(({ id }) => this.roleService.http.delete<void>(`${this.roleService.apiUrl}/${id}`).pipe(
            map(() => RolesActions.deleteRoleSuccess({ id })),
            catchError(error => of(RolesActions.deleteRoleFailure({ error: error })))
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
            this.roleService.removePermissionFromRole(roleId, permissionId).pipe(
                map(role => RolesActions.removePermissionFromRoleSuccess({ role })),
                catchError(error => of(RolesActions.removePermissionFromRoleFailure({ error: error.message })))
            )
        )
    ));

    addPermissionsBulkToRole$ = createEffect(() => this.actions$.pipe(
        ofType(RolesActions.addPermissionsBulkToRole),
        mergeMap(({ roleId, permissionIds }) =>
            this.roleService.addPermissionsBulkToRole(roleId, permissionIds).pipe(
                map(role => RolesActions.addPermissionsBulkToRoleSuccess({ role })),
                catchError(error => of(RolesActions.addPermissionsBulkToRoleFailure({ error: error.message })))
            )
        )
    ));
}
