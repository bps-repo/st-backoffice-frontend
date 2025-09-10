import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../core/services/authorization.service';

/**
 * Structural directive to conditionally render elements based on user permissions.
 *
 * Usage examples:
 *
 * Single permission:
 * <div *hasPermission="'students.view'">Content for users with students.view permission</div>
 *
 * Multiple permissions (any):
 * <div *hasPermission="['students.view', 'students.create']">Content for users with any of these permissions</div>
 *
 * Multiple permissions (all):
 * <div *hasPermission="['students.view', 'students.create']; requireAll: true">Content for users with all permissions</div>
 *
 * Module permission:
 * <div *hasPermission="'students'; module: true">Content for users with any students module permission</div>
 *
 * Module with specific action:
 * <div *hasPermission="'students'; module: true; action: 'manage'">Content for users with students.manage permission</div>
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private hasView = false;

  @Input() hasPermission: string | string[] = '';
  @Input() requireAll = false;
  @Input() module = false;
  @Input() action = 'view';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.checkPermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkPermission(): void {
    if (!this.hasPermission) {
      this.showView();
      return;
    }

    let permissionCheck$: Observable<boolean>;

    if (this.module) {
      // Module-based permission checking
      const moduleName = Array.isArray(this.hasPermission) ? this.hasPermission[0] : this.hasPermission;
      permissionCheck$ = this.authorizationService.hasModulePermission(moduleName, this.action);
    } else if (Array.isArray(this.hasPermission)) {
      // Multiple permissions
      permissionCheck$ = this.requireAll
        ? this.authorizationService.hasAllPermissions(this.hasPermission)
        : this.authorizationService.hasAnyPermission(this.hasPermission);
    } else {
      // Single permission
      permissionCheck$ = this.authorizationService.hasPermission(this.hasPermission);
    }

    permissionCheck$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(hasPermission => {
      if (hasPermission && !this.hasView) {
        this.showView();
      } else if (!hasPermission && this.hasView) {
        this.hideView();
      }
    });
  }

  private showView(): void {
    if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }

  private hideView(): void {
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
