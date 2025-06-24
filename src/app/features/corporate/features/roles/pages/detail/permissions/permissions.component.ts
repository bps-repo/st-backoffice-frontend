import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/core/models/auth/role';
import { Permission } from 'src/app/core/models/auth/permission';
import { RoleService } from 'src/app/core/services/role.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './permissions.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class PermissionsComponent implements OnInit, OnDestroy {
  role: Role | null = null;
  availablePermissions: Permission[] = [];
  selectedPermission: Permission | null = null;
  loading = false;
  adding = false;
  removing = false;
  private destroy$ = new Subject<void>();
  private roleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.roleId = Number(id);
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    if (!this.roleId) return;

    this.loading = true;

    forkJoin({
      role: this.roleService.getRole(this.roleId),
      permissions: this.permissionService.getPermissions()
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    ).subscribe({
      next: ({ role, permissions }) => {
        this.role = role;

        // Filter out permissions that the role already has
        const rolePermissionIds = new Set(role.permissions.map(p => p.id));
        this.availablePermissions = permissions.filter(permission => !rolePermissionIds.has(permission.id));
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados. Por favor, tente novamente.'
        });
      }
    });
  }

  addPermission(): void {
    if (!this.roleId || !this.selectedPermission) return;

    this.adding = true;
    this.roleService.addPermissionToRole(this.roleId, this.selectedPermission.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.adding = false)
    ).subscribe({
      next: (updatedRole) => {
        this.role = updatedRole;
        this.selectedPermission = null;

        // Update available permissions
        const rolePermissionIds = new Set(updatedRole.permissions.map(p => p.id));
        this.availablePermissions = this.availablePermissions.filter(permission => !rolePermissionIds.has(permission.id));

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Permissão adicionada com sucesso'
        });
      },
      error: (error) => {
        console.error('Error adding permission', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao adicionar permissão. Por favor, tente novamente.'
        });
      }
    });
  }

  removePermission(permission: Permission): void {
    if (!this.roleId) return;

    this.removing = true;
    this.roleService.removePermissionFromRole(this.roleId, permission.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.removing = false)
    ).subscribe({
      next: (updatedRole) => {
        this.role = updatedRole;

        // Update available permissions
        this.availablePermissions = [...this.availablePermissions, permission];

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Permissão removida com sucesso'
        });
      },
      error: (error) => {
        console.error('Error removing permission', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover permissão. Por favor, tente novamente.'
        });
      }
    });
  }
}
