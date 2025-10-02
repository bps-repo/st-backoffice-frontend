import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { PermissionService } from 'src/app/core/services/permission.service';
import * as PermissionsActions from '../actions/permissions.actions';

@Injectable()
export class PermissionsEffects {
    constructor(
        private actions$: Actions,
        private permissionService: PermissionService
    ) { }

    loadPermissions$ = createEffect(() => this.actions$.pipe(
        ofType(PermissionsActions.loadPermissions),
        switchMap(() => this.permissionService.getPermissionTree().pipe(
            map(permissions => PermissionsActions.loadPermissionsSuccess({ permissions })),
            catchError(error => of(PermissionsActions.loadPermissionsFailure({ error: error.message })))
        ))
    ));

    // The permission tree is already loaded by the getPermissions method
    loadPermissionTree$ = createEffect(() => this.actions$.pipe(
        ofType(PermissionsActions.loadPermissionTree),
        switchMap(() => this.permissionService.getPermissionTree().pipe(
            map(permissionTree => PermissionsActions.loadPermissionTreeSuccess({ permissionTree })),
            catchError(error => of(PermissionsActions.loadPermissionTreeFailure({ error: error.message })))
        ))
    ));

    loadPermission$ = createEffect(() => this.actions$.pipe(
        ofType(PermissionsActions.loadPermission),
        mergeMap(({ id }) => this.permissionService.fetchPermission(Number(id)).pipe(
            map(permission => PermissionsActions.loadPermissionSuccess({ permission })),
            catchError(error => of(PermissionsActions.loadPermissionFailure({ error: error.message })))
        ))
    ));

    updatePermission$ = createEffect(() => this.actions$.pipe(
        ofType(PermissionsActions.updatePermission),
        mergeMap(({ permission }) => this.permissionService.putPermission(permission).pipe(
            map(updatedPermission => PermissionsActions.updatePermissionSuccess({ permission: updatedPermission })),
            catchError(error => of(PermissionsActions.updatePermissionFailure({ error: error.message })))
        ))
    ));

    deletePermission$ = createEffect(() => this.actions$.pipe(
        ofType(PermissionsActions.deletePermission),
        mergeMap(({ id }) => this.permissionService.http.delete<void>(`${this.permissionService.apiUrl}/${id}`).pipe(
            map(() => PermissionsActions.deletePermissionSuccess({ id })),
            catchError(error => of(PermissionsActions.deletePermissionFailure({ error: error.message })))
        ))
    ));
}
