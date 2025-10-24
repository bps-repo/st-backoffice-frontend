import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../core/services/authorization.service';

/**
 * Pipe to check user permissions in templates.
 *
 * Usage examples:
 *
 * Single permission:
 * <div *ngIf="'students.view' | hasPermission | async">Content</div>
 *
 * Multiple permissions (any):
 * <div *ngIf="['students.view', 'students.create'] | hasPermission | async">Content</div>
 *
 * Multiple permissions (all):
 * <div *ngIf="['students.view', 'students.create'] | hasPermission:true | async">Content</div>
 *
 * Module permission:
 * <div *ngIf="'students' | hasPermission:false:'module' | async">Content</div>
 */
@Pipe({
  name: 'hasPermission',
  pure: false // Make it impure to react to permission changes
})
export class HasPermissionPipe implements PipeTransform {
  constructor(private authorizationService: AuthorizationService) {}

  transform(
    permission: string | string[],
    requireAll: boolean = false,
    type: 'permission' | 'module' = 'permission',
    action: string = 'view'
  ): Observable<boolean> {
    if (!permission) {
      return new Observable(observer => observer.next(false));
    }

    if (type === 'module') {
      const moduleName = Array.isArray(permission) ? permission[0] : permission;
      return this.authorizationService.hasModulePermission(moduleName, action);
    }

    if (Array.isArray(permission)) {
      return requireAll
        ? this.authorizationService.hasAllPermissions(permission)
        : this.authorizationService.hasAnyPermission(permission);
    }

    return this.authorizationService.hasPermission(permission);
  }
}
