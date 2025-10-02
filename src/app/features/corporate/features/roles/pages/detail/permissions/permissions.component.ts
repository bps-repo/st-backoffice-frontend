import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/core/models/auth/role';
import { Permission } from 'src/app/core/models/auth/permission';
import { RoleService } from 'src/app/core/services/role.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Subject, combineLatest, Observable, of } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from "primeng/ripple";
import { PermissionTreeSelectComponent } from './permission-tree-select/permission-tree-select.component';
import { Store } from "@ngrx/store";
import { selectAllPermissions, selectPermissionsLoading, selectPermissionTree } from "../../../../../../../core/store/permissions/selectors/permissions.selectors";
import { addPermissionsBulkToRole, loadRole, removePermissionFromRole } from 'src/app/core/store/roles/roles.actions';
import { selectRolesLoading, selectSelectedRole } from 'src/app/core/store/roles/roles.selectors';
import { loadPermissions, loadPermissionTree } from 'src/app/core/store/permissions/actions/permissions.actions';

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
    role$!: Observable<Role | null>;
    permissions$: Observable<Permission[]> = of([])
    availablePermissions: Permission[] = [];
    selectedPermissionIds: string[] = [];
    loading$: Observable<boolean> = of(false);
    hasSelectedPermissions = false;
    private destroy$ = new Subject<void>();
    private roleId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private readonly store$: Store
    ) {
        this.loading$ = this.store$.select(selectPermissionsLoading) || this.store$.select(selectRolesLoading)
        this.role$ = this.store$.select(selectSelectedRole) as Observable<Role | null>
        this.permissions$ = this.store$.select(selectPermissionTree)
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

        this.store$.dispatch(loadPermissionTree())
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData(): void {
        if (!this.roleId) return;

        this.store$.dispatch(loadRole({ id: this.roleId }))

        combineLatest({
            role: this.role$,
            permissions: this.permissions$
        }).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: ({ role, permissions }) => {
                if (!role) return; // Add null check

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


        this.selectedPermissionIds = this.selectedPermissionIds.filter(r => r != null)

        console.log("permissions", this.selectedPermissionIds);

        this.store$.dispatch(addPermissionsBulkToRole({ roleId: this.roleId, permissionIds: this.selectedPermissionIds }));
    }

    removePermission(permission: Permission): void {
        if (!this.roleId) return;

        this.store$.dispatch(removePermissionFromRole({ roleId: this.roleId, permissionId: permission.id }));
    }
}
