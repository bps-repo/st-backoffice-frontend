import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/auth/user';
import { Role } from 'src/app/core/models/auth/role';
import { Permission } from 'src/app/core/models/auth/permission';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { RoleService } from 'src/app/core/services/role.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    imports: [
        NgIf,
        FormsModule,
        NgForOf
    ]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  permissions: Permission[] = [];

  selectedUser: User | null = null;
  selectedRole: Role | null = null;
  selectedPermission: Permission | null = null;

  userRoles: Role[] = [];
  userPermissions: Permission[] = [];
  rolePermissions: Permission[] = [];

  constructor(
    private userManagementService: UserManagementService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadPermissions();
  }

  loadUsers(): void {
    this.userManagementService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadUserRoles(user.id);
    this.loadUserPermissions(user.id);
  }

  selectRole(role: Role): void {
    this.selectedRole = role;
    this.loadRolePermissions(role.id);
  }

  selectPermission(permission: Permission): void {
    this.selectedPermission = permission;
  }

  loadUserRoles(userId: string): void {
    this.userManagementService.getUserRoles(userId).subscribe(roles => {
      this.userRoles = roles;
    });
  }

  loadUserPermissions(userId: string): void {
    this.userManagementService.getUserPermissions(userId).subscribe(permissions => {
      this.userPermissions = permissions;
    });
  }

  loadRolePermissions(roleId: number): void {
    // Assuming the role object already has permissions
    if (this.selectedRole && this.selectedRole.permissions) {
      this.rolePermissions = this.selectedRole.permissions;
    }
  }

  addRoleToUser(): void {
    if (this.selectedUser && this.selectedRole) {
      this.userManagementService.addRoleToUser(this.selectedUser.id, this.selectedRole.id)
        .subscribe(() => {
          this.loadUserRoles(this.selectedUser!.id);
        });
    }
  }

  removeRoleFromUser(roleId: number): void {
    if (this.selectedUser) {
      this.userManagementService.removeRoleFromUser(this.selectedUser.id, roleId)
        .subscribe(() => {
          this.loadUserRoles(this.selectedUser!.id);
        });
    }
  }

  addPermissionToUser(): void {
    if (this.selectedUser && this.selectedPermission) {
      this.userManagementService.addPermissionToUser(this.selectedUser.id, this.selectedPermission.id)
        .subscribe(() => {
          this.loadUserPermissions(this.selectedUser!.id);
        });
    }
  }

  removePermissionFromUser(permissionId: number): void {
    if (this.selectedUser) {
      this.userManagementService.removePermissionFromUser(this.selectedUser.id, permissionId)
        .subscribe(() => {
          this.loadUserPermissions(this.selectedUser!.id);
        });
    }
  }

  addPermissionToRole(): void {
    if (this.selectedRole && this.selectedPermission) {
      this.roleService.addPermissionToRole(this.selectedRole.id, this.selectedPermission.id)
        .subscribe(() => {
          this.loadRolePermissions(this.selectedRole!.id);
        });
    }
  }

  removePermissionFromRole(permissionId: number): void {
    if (this.selectedRole) {
      this.roleService.removePermissionFromRole(this.selectedRole.id, permissionId)
        .subscribe(() => {
          this.loadRolePermissions(this.selectedRole!.id);
        });
    }
  }

  createRole(name: string, description: string): void {
    const newRole: Role = {
      id: 0, // Will be assigned by the server
      name,
      description,
      permissions: []
    };

    this.roleService.createRole(newRole).subscribe(() => {
      this.loadRoles();
    });
  }

  deleteRole(roleId: number): void {
    this.roleService.deleteRole(roleId).subscribe(() => {
      this.loadRoles();
      if (this.selectedRole && this.selectedRole.id === roleId) {
        this.selectedRole = null;
      }
    });
  }
}
