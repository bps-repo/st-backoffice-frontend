import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { Permission } from '../../../core/models/auth/permission';

/**
 * Example component demonstrating how to use the AuthorizationService
 * and related directives/pipes for permission-based access control.
 */
@Component({
  selector: 'app-authorization-examples',
  template: `
    <div class="authorization-examples">
      <h2>Authorization Examples</h2>

      <!-- Example 1: Using the directive for single permission -->
      <div class="example-section">
        <h3>1. Single Permission Check (Directive)</h3>
        <div *hasPermission="'students.view'" class="permission-granted">
          ✅ You have students.view permission
        </div>
        <div *hasPermission="'students.create'" class="permission-granted">
          ✅ You have students.create permission
        </div>
      </div>

      <!-- Example 2: Using the directive for multiple permissions (any) -->
      <div class="example-section">
        <h3>2. Multiple Permissions - Any (Directive)</h3>
        <div *hasPermission="['students.view', 'students.create']" class="permission-granted">
          ✅ You have at least one of: students.view or students.create
        </div>
      </div>

      <!-- Example 3: Using the directive for multiple permissions (all) -->
      <div class="example-section">
        <h3>3. Multiple Permissions - All (Directive)</h3>
        <div *hasPermission="['students.view', 'students.create']; requireAll: true" class="permission-granted">
          ✅ You have both: students.view AND students.create
        </div>
      </div>

      <!-- Example 4: Using the directive for module permissions -->
      <div class="example-section">
        <h3>4. Module Permission Check (Directive)</h3>
        <div *hasPermission="'students'; module: true" class="permission-granted">
          ✅ You have any students module permission
        </div>
        <div *hasPermission="'students'; module: true; action: 'manage'" class="permission-granted">
          ✅ You have students.manage permission
        </div>
      </div>

      <!-- Example 5: Using the pipe in *ngIf -->
      <div class="example-section">
        <h3>5. Permission Check with Pipe</h3>
        <div *ngIf="'students.view' | hasPermission | async" class="permission-granted">
          ✅ You have students.view permission (using pipe)
        </div>
        <div *ngIf="['students.view', 'students.create'] | hasPermission | async" class="permission-granted">
          ✅ You have any of these permissions (using pipe)
        </div>
        <div *ngIf="['students.view', 'students.create'] | hasPermission:true | async" class="permission-granted">
          ✅ You have all of these permissions (using pipe)
        </div>
      </div>

      <!-- Example 6: Using the service in component -->
      <div class="example-section">
        <h3>6. Permission Check in Component</h3>
        <div *ngIf="hasStudentsView$ | async" class="permission-granted">
          ✅ You have students.view permission (from component)
        </div>
        <div *ngIf="hasStudentsManage$ | async" class="permission-granted">
          ✅ You have students.manage permission (from component)
        </div>
        <div *ngIf="hasAnyStudentsPermission$ | async" class="permission-granted">
          ✅ You have any students module permission (from component)
        </div>
      </div>

      <!-- Example 7: Displaying user permissions -->
      <div class="example-section">
        <h3>7. Current User Permissions</h3>
        <div *ngIf="userPermissions$ | async as permissions">
          <p>You have {{ permissions.length }} permissions:</p>
          <ul>
            <li *ngFor="let permission of permissions">{{ permission.name }} - {{ permission.description }}</li>
          </ul>
        </div>
      </div>

      <!-- Example 8: Module-specific permissions -->
      <div class="example-section">
        <h3>8. Students Module Permissions</h3>
        <div *ngIf="studentsPermissions$ | async as permissions">
          <p>Students module permissions ({{ permissions.length }}):</p>
          <ul>
            <li *ngFor="let permission of permissions">{{ permission.name }}</li>
          </ul>
        </div>
      </div>

      <!-- Example 9: Conditional buttons based on permissions -->
      <div class="example-section">
        <h3>9. Conditional Action Buttons</h3>
        <button *hasPermission="'students.create'" class="btn btn-primary">
          Create Student
        </button>
        <button *hasPermission="'students.update'" class="btn btn-secondary">
          Edit Student
        </button>
        <button *hasPermission="'students.delete'" class="btn btn-danger">
          Delete Student
        </button>
        <button *hasPermission="'students'; module: true; action: 'manage'" class="btn btn-success">
          Manage All Students
        </button>
      </div>

      <!-- Example 10: Complex permission logic -->
      <div class="example-section">
        <h3>10. Complex Permission Logic</h3>
        <div *ngIf="canManageStudents$ | async" class="permission-granted">
          ✅ You can manage students (has students.manage OR both students.create and students.update)
        </div>
        <div *ngIf="canViewStudents$ | async" class="permission-granted">
          ✅ You can view students (has students.view OR students.manage)
        </div>
      </div>
    </div>
  `,
  styles: [`
    .authorization-examples {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .example-section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .permission-granted {
      background-color: #d4edda;
      color: #155724;
      padding: 10px;
      border-radius: 3px;
      margin: 5px 0;
    }

    .btn {
      margin: 5px;
      padding: 8px 16px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-success { background-color: #28a745; color: white; }
  `]
})
export class AuthorizationExamplesComponent implements OnInit {
  // Observable properties for permission checks
  hasStudentsView$: Observable<boolean>;
  hasStudentsManage$: Observable<boolean>;
  hasAnyStudentsPermission$: Observable<boolean>;
  userPermissions$: Observable<Permission[]>;
  studentsPermissions$: Observable<Permission[]>;
  canManageStudents$: Observable<boolean>;
  canViewStudents$: Observable<boolean>;

  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    // Initialize permission observables
    this.hasStudentsView$ = this.authorizationService.hasPermission('students.view');
    this.hasStudentsManage$ = this.authorizationService.hasPermission('students.manage');
    this.hasAnyStudentsPermission$ = this.authorizationService.hasAnyModulePermission('students');
    this.userPermissions$ = this.authorizationService.getCurrentUserPermissions();
    this.studentsPermissions$ = this.authorizationService.getModulePermissions('students');

    // Complex permission logic examples
    this.canManageStudents$ = this.authorizationService.hasAnyPermission([
      'students.manage',
      // You could add more complex logic here
    ]);

    this.canViewStudents$ = this.authorizationService.hasAnyPermission([
      'students.view',
      'students.manage'
    ]);
  }

  // Example method for programmatic permission checking
  async checkPermissionExample(): Promise<void> {
    const hasPermission = await this.authorizationService.hasPermission('students.create').toPromise();

    if (hasPermission) {
      console.log('User can create students');
      // Proceed with student creation
    } else {
      console.log('User cannot create students');
      // Show error message or redirect
    }
  }

  // Example method for checking multiple permissions
  async checkMultiplePermissionsExample(): Promise<void> {
    const hasAllPermissions = await this.authorizationService.hasAllPermissions([
      'students.view',
      'students.create',
      'students.update'
    ]).toPromise();

    if (hasAllPermissions) {
      console.log('User has all required permissions');
    } else {
      console.log('User is missing some permissions');
    }
  }

  // Example method for module permission checking
  async checkModulePermissionExample(): Promise<void> {
    const hasModulePermission = await this.authorizationService.hasModulePermission('students', 'manage').toPromise();

    if (hasModulePermission) {
      console.log('User can manage students module');
    } else {
      console.log('User cannot manage students module');
    }
  }
}
