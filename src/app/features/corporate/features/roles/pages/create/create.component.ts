import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/core/services/role.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Role } from 'src/app/core/models/auth/role';
import { Permission } from 'src/app/core/models/auth/permission';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { finalize } from 'rxjs/operators';
import {
    PermissionTreeSelectComponent
} from "../detail/permissions/permission-tree-select/permission-tree-select.component";
import { RippleModule } from "primeng/ripple";
import { Store } from "@ngrx/store";
import { selectPermissionsLoading, selectPermissionTree } from "../../../../../../core/store/permissions/selectors/permissions.selectors";
import { Observable, of } from "rxjs";
import { loadPermissionTree } from 'src/app/core/store/permissions/actions/permissions.actions';

@Component({
    selector: 'app-create-role',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        PermissionTreeSelectComponent,
        RippleModule
    ]
})
export class CreateComponent implements OnInit {
    roleForm!: FormGroup;
    loading = false;

    permissions$: Observable<Permission[]> = of([]);
    permissionsLoading: Observable<boolean> = of(false)
    selectedPermissionIds: string[] = [];

    constructor(
        private fb: FormBuilder,
        private roleService: RoleService,
        private router: Router,
        private readonly store$: Store
    ) {
        this.permissionsLoading = store$.select(selectPermissionsLoading)
        this.permissions$ = store$.select(selectPermissionTree)
    }

    ngOnInit(): void {
        this.initForm();
        this.loadPermissions();
    }

    initForm(): void {
        this.roleForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    loadPermissions(): void {
        this.store$.dispatch(loadPermissionTree());
    }

    onPermissionSelected(permissionIds: string[]): void {
        this.selectedPermissionIds = permissionIds;
    }

    onSubmit(): void {
        if (this.roleForm.invalid) {
            return;
        }

        this.loading = true;
        const formValue = this.roleForm.value;

        // Create the role with permissions in a single request
        this.roleService.createRoleWithPermissions(
            formValue.name,
            formValue.description,
            this.selectedPermissionIds
        )
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (createdRole) => {
                    this.router.navigate(['/corporate/roles', createdRole.id]).then();
                },
                error: (error) => {
                    console.error('Error creating role with permissions', error);
                }
            });
    }

    cancel(): void {
        this.router.navigate(['/corporate/roles']).then();
    }
}
