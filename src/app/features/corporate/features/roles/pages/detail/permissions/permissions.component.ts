import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Role} from 'src/app/core/models/auth/role';
import {Permission} from 'src/app/core/models/auth/permission';
import {RoleService} from 'src/app/core/services/role.service';
import {PermissionService} from 'src/app/core/services/permission.service';
import {Subject, combineLatest, Observable, of} from 'rxjs';
import {takeUntil, finalize} from 'rxjs/operators';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {RippleModule} from "primeng/ripple";
import {PermissionTreeSelectComponent} from './permission-tree-select/permission-tree-select.component';
import {Store} from "@ngrx/store";
import {selectPermissionsLoading} from "../../../../../../../core/store/permissions/selectors/permissions.selectors";

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
        ToastModule,
        RippleModule,
        PermissionTreeSelectComponent
    ],
    providers: [MessageService]
})
export class PermissionsComponent implements OnInit, OnDestroy {
    role: Role | null = null;
    availablePermissions: Permission[] = [];
    selectedPermissionIds: string[] = [];
    loading$: Observable<boolean> = of(false);
    adding = false;
    removing = false;
    hasSelectedPermissions = false;
    private destroy$ = new Subject<void>();
    private roleId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private roleService: RoleService,
        private permissionService: PermissionService,
        private messageService: MessageService,
        private readonly store$: Store
    ) {
        this.loading$ = this.store$.select(selectPermissionsLoading)
    }

    ngOnInit(): void {
        this.route.parent?.paramMap.pipe(
            takeUntil(this.destroy$)
        ).subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.roleId = id;
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

        combineLatest({
            role: this.roleService.getRoleById(this.roleId),
            permissions: this.permissionService.getPermissions()
        }).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: ({role, permissions}) => {
                this.role = role;
                console.log("")

                console.log("roles:", role)
                console.log("permissions:", permissions)


                // Filter out permissions that the role already has
                const rolePermissionIds = new Set(role.permissions.map(p => p.id));
                this.availablePermissions = permissions.filter(permission => !rolePermissionIds.has(permission.id));
            },
            error: (error) => {
                console.error('Error loading data per', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados. Por favor, tente novamente.'
                });
            }
        });
    }

    onPermissionsSelected(permissionIds: string[]): void {
        this.selectedPermissionIds = permissionIds;
        this.hasSelectedPermissions = permissionIds.length > 0;
    }

    addSelectedPermissions(): void {
        if (!this.roleId || this.selectedPermissionIds.length === 0) return;

        this.adding = true;

        // Use the bulk add method instead of individual calls
        const permissionCount = this.selectedPermissionIds.length;
        this.roleService.addPermissionsBulkToRole(this.roleId, this.selectedPermissionIds).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.adding = false)
        ).subscribe({
            next: (updatedRole) => {
                this.role = updatedRole;
                this.selectedPermissionIds = [];
                this.hasSelectedPermissions = false;

                // Update available permissions
                const rolePermissionIds = new Set(this.role.permissions.map(p => p.id));
                this.availablePermissions = this.availablePermissions.filter(permission => !rolePermissionIds.has(permission.id));

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `${permissionCount} permissão(ões) adicionada(s) com sucesso`
                });
            },
            error: (error) => {
                console.error('Error adding permissions', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao adicionar permissões. Por favor, tente novamente.'
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
                // Check if the permission is already in availablePermissions before adding it
                if (!this.availablePermissions.some(p => p.id === permission.id)) {
                    this.availablePermissions = [...this.availablePermissions, permission];
                }

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
