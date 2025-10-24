import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Permission } from 'src/app/core/models/auth/permission';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
    PermissionTreeSelectComponent
} from "../detail/permissions/permission-tree-select/permission-tree-select.component";
import { RippleModule } from "primeng/ripple";
import { Store } from "@ngrx/store";
import { selectPermissionsLoading, selectPermissionTree } from "../../../../../../core/store/permissions/selectors/permissions.selectors";
import { combineLatest, filter, map, Observable, of, Subject, takeUntil } from "rxjs";
import { loadPermissionTree } from 'src/app/core/store/permissions/actions/permissions.actions';
import { selectRolesError, selectRolesLoading, selectSuccessFlag } from 'src/app/core/store/roles/roles.selectors';
import { createRoleWithPermissions } from 'src/app/core/store/roles/roles.actions';
import { MessageService } from 'primeng/api';

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
export class CreateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    roleForm!: FormGroup;
    permissions$: Observable<Permission[]> = of([]);
    permissionsLoading: Observable<boolean> = of(false)
    loading$: Observable<boolean> = of(false)
    selectedPermissionIds: string[] = [];
    errors$: Observable<any> = of(null)

    successFlag$: Observable<boolean> = of(false)

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private readonly store$: Store,
        private messageService: MessageService
    ) {
        this.loading$ = combineLatest([
            this.store$.select(selectPermissionsLoading),
            this.store$.select(selectRolesLoading)
        ]).pipe(
            map(([permissionsLoading, rolesLoading]) => permissionsLoading || rolesLoading)
        );


        this.permissionsLoading = store$.select(selectPermissionsLoading)
        this.permissions$ = store$.select(selectPermissionTree)

        this.errors$ = this.store$.select(selectRolesError)
        this.successFlag$ = this.store$.select(selectSuccessFlag)

        this.errors$.pipe(
            takeUntil(this.destroy$),
            filter(v => !!v)
        ).subscribe((v) => {
            this.messageService.add({
                severity: "danger",
                detail: v,
            });
        });

        this.successFlag$.subscribe((v) => {
            if (v) {
                this.router.navigate(['/corporate/roles']).then();

                this.messageService.add({
                    severity: "success",
                    detail: "Novo perfil adicionado",
                });
            }
        })
    }

    ngOnInit(): void {
        this.initForm();
        this.loadPermissions();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
        const formValue = this.roleForm.value;

        this.selectedPermissionIds = this.selectedPermissionIds.filter(f => f != null)

        console.log("selected permissions", this.selectedPermissionIds);


        this.store$.dispatch(createRoleWithPermissions({ name: formValue.name, description: formValue.description, permissionIds: this.selectedPermissionIds }))

        this.roleForm.reset()
    }

    cancel(): void {
        this.router.navigate(['/corporate/roles']).then();
    }
}
